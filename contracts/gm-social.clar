;; Gm Social Protocol - On-Chain Reputation & Social Graph (Clarity v4)

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-COOLDOWN-ACTIVE (err u101))
(define-constant ERR-USERNAME-TAKEN (err u102))
(define-constant ERR-ALREADY-SET (err u103))
(define-constant ERR-INVALID-NAME (err u104))
(define-constant ERR-INSUFFICIENT-FUNDS (err u105))
(define-constant ERR-NOT-PRO (err u106))
(define-constant ERR-STREAK-NOT-BROKEN (err u107))
(define-constant ERR-NO-HEALS-LEFT (err u108))
(define-constant ERR-ALREADY-PRO (err u109))

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant COOLDOWN-BLOCKS u144) ;; ~24 hours
(define-constant GRACE-PERIOD-BLOCKS u288) ;; ~48 hours
(define-constant PRO-PRICE u10000000) ;; 10 STX in microSTX
(define-constant SUBSCRIPTION-DURATION-BLOCKS u4320) ;; ~30 days
(define-constant INITIAL-HEALS u2)
(define-constant BOOST-COST u5000000) ;; 5 $GM
(define-constant MIN-PROPOSAL-BALANCE u100000000) ;; 100 $GM to submit proposal? No, user said Pro.

;; Governance & Economy
(define-data-var token-contract principal .gm-token-v2)
(define-data-var total-gm-burned uint u0)
(define-data-var active-proposal-round uint u1)

;; Data Maps
(define-map users
    principal
    {
        last-gm: uint, ;; Stores burn-block-height
        streak: uint,
        points: uint,
        username: (optional (string-utf8 20)),
        is-pro: bool,
        pro-expiry: uint, ;; Stores burn-block-height
        heal-count: uint,
        total-tipped: uint,
        total-received: uint
    }
)

(define-map usernames (string-utf8 20) principal)

(define-map followers { user: principal, follower: principal } bool)
(define-map follow-counts principal { followers: uint, following: uint })

;; DAO Maps
(define-map post-boosts (buff 32) { weight: uint, expiration: uint })
(define-map proposals uint { title: (string-utf8 100), end-time: uint, active: bool })
(define-map proposal-votes { round: uint, voter: principal } { weight: uint, option: uint })
(define-map proposal-results { round: uint, option: uint } uint)

;; Public Functions

;; @desc Say GM - Increments streak and adds 0.5 points (1.0 for Pro)
(define-public (say-gm)
  (let (
        (user-data (get-user-profile tx-sender))
        (current-height burn-block-height)
        (last-gm (get last-gm user-data))
        (blocks-passed (if (> current-height last-gm) (- current-height last-gm) u0))
        (is-currently-pro (is-pro-active tx-sender))
    )
    
    ;; 1. Check if ~24h (144 blocks) passed
    (asserts! (or (is-eq last-gm u0) (> blocks-passed COOLDOWN-BLOCKS)) ERR-COOLDOWN-ACTIVE)

    ;; 2. Logic for streak
    (let (
            (new-streak (if (<= blocks-passed GRACE-PERIOD-BLOCKS)
                (+ (get streak user-data) u1)
                u1 ;; Reset streak if missed grace period
            ))
            ;; Pro users get 1.0 points (u10), Standard get 0.5 (u5)
            (points-to-add (if is-currently-pro u10 u5))
            (new-points (+ (get points user-data) points-to-add))
        )
        (map-set users tx-sender
            (merge user-data {
                last-gm: current-height,
                streak: new-streak,
                points: new-points,
                is-pro: is-currently-pro
            })
        )
        (print { event: "gm", user: tx-sender, streak: new-streak, points: new-points, timestamp: current-height })
        
        ;; 3. Mint $GM Token Rewards (1 for Standard, 2 for Pro)
        ;; Note: We use micro-measurements so 1.0 GM = u1000000
        (let (
            (tokens-to-mint (if is-currently-pro u2000000 u1000000))
        )
            (try! (contract-call? .gm-token-v2 mint tokens-to-mint tx-sender))
        )
        
        (ok { streak: new-streak, points: new-points })
    )
  )
)

;; @desc Get current burn block height for frontend synchronization
(define-read-only (get-current-burn-height)
    (ok burn-block-height)
)

;; @desc Subscribe to Pro Plan (10 STX)
(define-public (subscribe-pro)
  (let (
    (user-data (get-user-profile tx-sender))
    (current-height burn-block-height)
  )
    ;; 0. Check if already Pro
    (asserts! (not (is-pro-active tx-sender)) ERR-ALREADY-PRO)

    ;; 1. Transfer STX to contract owner (unless it's the owner themselves subscribing)
    (if (not (is-eq tx-sender CONTRACT-OWNER))
        (try! (stx-transfer? PRO-PRICE tx-sender CONTRACT-OWNER))
        true
    )
    
    ;; 2. Update user data
    (map-set users tx-sender
        (merge user-data {
            is-pro: true,
            pro-expiry: (+ current-height SUBSCRIPTION-DURATION-BLOCKS),
            heal-count: INITIAL-HEALS
        })
    )
    (ok true)
  )
)

;; @desc Restore a broken streak (requires Pro + Heal Count)
(define-public (heal-streak)
  (let (
    (user-data (get-user-profile tx-sender))
    (current-height burn-block-height)
    (last-gm (get last-gm user-data))
    (blocks-passed (if (> current-height last-gm) (- current-height last-gm) u0))
  )
    (asserts! (is-pro-active tx-sender) ERR-NOT-PRO)
    (asserts! (> blocks-passed GRACE-PERIOD-BLOCKS) ERR-STREAK-NOT-BROKEN)
    (asserts! (> (get heal-count user-data) u0) ERR-NO-HEALS-LEFT)
    
    (map-set users tx-sender
        (merge user-data {
            last-gm: (- current-height COOLDOWN-BLOCKS), ;; Set it to just over 24h ago
            heal-count: (- (get heal-count user-data) u1)
        })
    )
    (ok true)
  )
)

;; @desc Follow a user
(define-public (follow (target principal))
  (let (
    (sender-counts (get-follow-counts tx-sender))
    (target-counts (get-follow-counts target))
  )
    (asserts! (not (is-eq tx-sender target)) (err u108))
    (map-set followers { user: target, follower: tx-sender } true)
    (map-set follow-counts tx-sender (merge sender-counts { following: (+ (get following sender-counts) u1) }))
    (map-set follow-counts target (merge target-counts { followers: (+ (get followers target-counts) u1) }))
    (ok true)
  )
)

;; @desc Tip an author - Transfers STX and awards reputation to both
(define-public (tip-author (recipient principal) (amount uint))
  (let (
    (tipper-data (get-user-profile tx-sender))
    (recipient-data (get-user-profile recipient))
    ;; Reputation: 10 points per 1 STX (microSTX/100,000)
    (points-to-add (/ (* amount u10) u1000000))
  )
    (asserts! (not (is-eq tx-sender recipient)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-NAME)
    
    ;; 1. Execute Transfer
    (try! (stx-transfer? amount tx-sender recipient))
    
    ;; 2. Update Tipper Data
    (map-set users tx-sender
        (merge tipper-data {
            points: (+ (get points tipper-data) points-to-add),
            total-tipped: (+ (get total-tipped tipper-data) amount)
        })
    )
    
    ;; 3. Update Recipient Data
    (map-set users recipient
        (merge recipient-data {
            points: (+ (get points recipient-data) (/ points-to-add u2)), ;; Recipient gets half points
            total-received: (+ (get total-received recipient-data) amount)
        })
    )
    
    (print { 
        event: "tip", 
        from: tx-sender, 
        to: recipient, 
        amount: amount,
        points-awarded: points-to-add 
    })

    ;; 4. Award $GM Token "Gratitude" Reward to Tipper (5 $GM)
    (try! (contract-call? .gm-token-v2 mint u5000000 tx-sender))

    (ok true)
  )
)


;; @desc Set username
(define-public (set-username (new-name (string-utf8 20)))
  (let (
        (user-data (get-user-profile tx-sender))
    )
    (asserts! (>= (len new-name) u3) ERR-INVALID-NAME)
    (asserts! (is-none (get username user-data)) ERR-ALREADY-SET)
    (asserts! (is-none (map-get? usernames new-name)) ERR-USERNAME-TAKEN)

    (map-set usernames new-name tx-sender)
    (map-set users tx-sender (merge user-data { username: (some new-name) }))
    (ok true)
  )
)

;; DAO Functions

;; @desc Boost a post by burning $GM tokens
(define-public (boost-post (post-txid (buff 32)))
  (let (
    (current-burned (var-get total-gm-burned))
  )
    ;; 1. Burn the $GM tokens from the sender
    (try! (contract-call? .gm-token-v2 burn BOOST-COST tx-sender))
    
    ;; 2. Record the boost (lasts ~24 hours / 144 blocks)
    (map-set post-boosts post-txid 
      { 
        weight: (+ (default-to u0 (get weight (map-get? post-boosts post-txid))) u1), 
        expiration: (+ burn-block-height u144) 
      }
    )
    
    ;; 3. Update global stats
    (var-set total-gm-burned (+ current-burned BOOST-COST))
    
    (print { event: "boost", post: post-txid, user: tx-sender, cost: BOOST-COST })
    (ok true)
  )
)

;; @desc Submit a weighted vote on a proposal
(define-public (submit-vote (round uint) (option uint))
  (let (
    (voter-balance (unwrap! (contract-call? .gm-token-v2 get-balance tx-sender) ERR-NOT-AUTHORIZED))
    (proposal-data (unwrap! (map-get? proposals round) ERR-NOT-AUTHORIZED))
  )
    ;; check if proposal is active
    (asserts! (get active proposal-data) ERR-NOT-AUTHORIZED)
    (asserts! (< burn-block-height (get end-time proposal-data)) ERR-NOT-AUTHORIZED)
    
    ;; Record vote
    (map-set proposal-votes { round: round, voter: tx-sender } { weight: voter-balance, option: option })
    
    ;; Update results tally
    (let ((current-tally (default-to u0 (map-get? proposal-results { round: round, option: option }))))
      (map-set proposal-results { round: round, option: option } (+ current-tally voter-balance))
    )
    
    (ok true)
  )
)

;; @desc Create a new proposal (Pro Only)
(define-public (create-proposal (title (string-utf8 100)))
  (let (
    (new-id (var-get active-proposal-round))
  )
    (asserts! (is-pro-active tx-sender) ERR-NOT-PRO)
    
    (map-set proposals new-id { title: title, end-time: (+ burn-block-height u1000), active: true })
    (var-set active-proposal-round (+ new-id u1))
    (ok new-id)
  )
)

;; Read-Only Functions

(define-read-only (get-user-data (user principal))
  (let (
    (profile (get-user-profile user))
    (counts (get-follow-counts user))
  )
    (ok (merge profile { 
        followers: (get followers counts), 
        following: (get following counts) 
    }))
  )
)

(define-read-only (get-post-boost (post-txid (buff 32)))
    (let (
        (boost (map-get? post-boosts post-txid))
    )
    (if (and (is-some boost) (< burn-block-height (get expiration (unwrap-panic boost))))
        (get weight (unwrap-panic boost))
        u0
    )
    )
)

(define-read-only (get-protocol-stats)
    (ok {
        total-gm-burned: (var-get total-gm-burned),
        active-proposals: (- (var-get active-proposal-round) u1)
    })
)

(define-read-only (is-pro-active (user principal))
    (let (
        (user-data (default-to { pro-expiry: u0 } (map-get? users user)))
    )
    (> (get pro-expiry user-data) burn-block-height)
    )
)

;; Private Helpers

(define-private (get-user-profile (user principal))
    (default-to 
        { 
            last-gm: u0, streak: u0, points: u0, username: none, 
            is-pro: false, pro-expiry: u0, heal-count: u0,
            total-tipped: u0, total-received: u0 
        } 
        (map-get? users user)
    )
)

(define-private (get-follow-counts (user principal))
    (default-to { followers: u0, following: u0 } (map-get? follow-counts user))
)