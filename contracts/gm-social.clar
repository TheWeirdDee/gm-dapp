;; Gm Social Protocol - On-Chain Reputation & Social Graph (Clarity v2)

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

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant COOLDOWN-BLOCKS u144) ;; ~24 hours
(define-constant GRACE-PERIOD-BLOCKS u288) ;; ~48 hours
(define-constant PRO-PRICE u10000000) ;; 10 STX in microSTX
(define-constant SUBSCRIPTION-DURATION u4320) ;; ~30 days
(define-constant INITIAL-HEALS u2)

;; Data Maps
(define-map users
    principal
    {
        last-gm: uint,
        streak: uint,
        points: uint,
        username: (optional (string-utf8 20)),
        is-pro: bool,
        pro-expiry: uint,
        heal-count: uint
    }
)

(define-map usernames (string-utf8 20) principal)

(define-map followers { user: principal, follower: principal } bool)
(define-map follow-counts principal { followers: uint, following: uint })

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
    
    ;; 1. Check if 24h passed
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
        (print { event: "gm", user: tx-sender, streak: new-streak, points: new-points })
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
    ;; 1. Transfer STX to contract owner (unless it's the owner themselves subscribing)
    (if (not (is-eq tx-sender CONTRACT-OWNER))
        (try! (stx-transfer? PRO-PRICE tx-sender CONTRACT-OWNER))
        true
    )
    
    ;; 2. Update user data
    (map-set users tx-sender
        (merge user-data {
            is-pro: true,
            pro-expiry: (+ current-height SUBSCRIPTION-DURATION),
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
        { last-gm: u0, streak: u0, points: u0, username: none, is-pro: false, pro-expiry: u0, heal-count: u0 } 
        (map-get? users user)
    )
)

(define-private (get-follow-counts (user principal))
    (default-to { followers: u0, following: u0 } (map-get? follow-counts user))
)