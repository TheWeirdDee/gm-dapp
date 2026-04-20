;; Gm Social Protocol - FINAL SAFE VERSION

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
(define-constant COOLDOWN-BLOCKS u144)
(define-constant GRACE-PERIOD-BLOCKS u288)
(define-constant PRO-PRICE u10000000)
(define-constant SUBSCRIPTION-DURATION-BLOCKS u4320)
(define-constant INITIAL-HEALS u2)
(define-constant BOOST-COST u5000000)

;; Data Vars
(define-data-var token-contract principal .gm-token-v2)
(define-data-var total-gm-burned uint u0)
(define-data-var active-proposal-round uint u1)

(define-public (set-token-contract (contract principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set token-contract contract)
    (ok true)
  )
)

;; Maps
(define-map users principal {
  last-gm: uint, streak: uint, points: uint,
  username: (optional (string-utf8 20)),
  is-pro: bool, pro-expiry: uint, heal-count: uint,
  total-tipped: uint, total-received: uint
})

(define-map usernames (string-utf8 20) principal)
(define-map followers { user: principal, follower: principal } bool)
(define-map follow-counts principal { followers: uint, following: uint })

(define-map post-boosts (buff 32) { weight: uint, expiration: uint })
(define-map proposals uint { title: (string-utf8 100), end-time: uint, active: bool })
(define-map proposal-votes { round: uint, voter: principal } { weight: uint, option: uint })
(define-map proposal-results { round: uint, option: uint } uint)

;; Helpers
(define-private (get-user-profile (user principal))
  (default-to {
    last-gm: u0, streak: u0, points: u0, username: none,
    is-pro: false, pro-expiry: u0, heal-count: u0,
    total-tipped: u0, total-received: u0
  } (map-get? users user))
)

(define-private (get-follow-counts (user principal))
  (default-to { followers: u0, following: u0 } (map-get? follow-counts user))
)

(define-read-only (is-pro-active (user principal))
  (> (get pro-expiry (get-user-profile user)) burn-block-height)
)

;; CORE

(define-public (say-gm)
  (let (
    (u (get-user-profile tx-sender))
    (h burn-block-height)
    (last (get last-gm u))
    (passed (if (> h last) (- h last) u0))
    (pro (is-pro-active tx-sender))
  )
    (asserts! (or (is-eq last u0) (> passed COOLDOWN-BLOCKS)) ERR-COOLDOWN-ACTIVE)

    (let (
      (streak (if (<= passed GRACE-PERIOD-BLOCKS) (+ (get streak u) u1) u1))
      (pts (+ (get points u) (if pro u10 u5)))
      (mint-amount (if pro u2000000 u1000000))
    )
      (map-set users tx-sender (merge u {
        last-gm: h, streak: streak, points: pts, is-pro: pro
      }))

      ;; Safety Check & Bridge
      (asserts! (is-eq (var-get token-contract) .gm-token-v2) ERR-NOT-AUTHORIZED)
      (try! (as-contract (contract-call? .gm-token-v2 mint mint-amount tx-sender)))

      (ok { streak: streak, points: pts })
    )
  )
)

(define-public (follow (target principal))
  (let (
    (s (get-follow-counts tx-sender))
    (t (get-follow-counts target))
  )
    (asserts! (not (is-eq tx-sender target)) ERR-NOT-AUTHORIZED)
    (asserts! (is-none (map-get? followers { user: target, follower: tx-sender })) ERR-ALREADY-SET)

    (map-set followers { user: target, follower: tx-sender } true)
    (map-set follow-counts tx-sender (merge s { following: (+ (get following s) u1) }))
    (map-set follow-counts target (merge t { followers: (+ (get followers t) u1) }))

    (ok true)
  )
)

(define-public (tip-author (recipient principal) (amount uint))
  (let (
    (t (get-user-profile tx-sender))
    (r (get-user-profile recipient))
    (pts (/ (* amount u10) u1000000))
  )
    (asserts! (not (is-eq tx-sender recipient)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INSUFFICIENT-FUNDS)

    (try! (stx-transfer? amount tx-sender recipient))

    (map-set users tx-sender (merge t {
      points: (+ (get points t) pts),
      total-tipped: (+ (get total-tipped t) amount)
    }))

    (map-set users recipient (merge r {
      points: (+ (get points r) (/ pts u2)),
      total-received: (+ (get total-received r) amount)
    }))

    ;; Safety Check & Bridge
    (asserts! (is-eq (var-get token-contract) .gm-token-v2) ERR-NOT-AUTHORIZED)
    (try! (as-contract (contract-call? .gm-token-v2 mint u5000000 tx-sender)))

    (ok true)
  )
)

(define-public (boost-post (post (buff 32)))
  (let ((burned (var-get total-gm-burned)))
    ;; Safety Check & Bridge
    (asserts! (is-eq (var-get token-contract) .gm-token-v2) ERR-NOT-AUTHORIZED)
    (try! (as-contract (contract-call? .gm-token-v2 burn BOOST-COST tx-sender)))

    ;; update boost safely
    (let (
      (existing (map-get? post-boosts post))
      (new-weight (if (is-some existing)
                    (+ (get weight (unwrap! existing (err u0))) u1)
                    u1))
    )
      (map-set post-boosts post {
        weight: new-weight,
        expiration: (+ burn-block-height u144)
      })
    )

    (var-set total-gm-burned (+ burned BOOST-COST))
    (ok true)
  )
)

(define-public (submit-vote (round uint) (option uint))
  (let (
    (bal (unwrap! (contract-call? .gm-token-v2 get-balance tx-sender) ERR-NOT-AUTHORIZED))
    (p (unwrap! (map-get? proposals round) ERR-NOT-AUTHORIZED))
  )
    (asserts! (get active p) ERR-NOT-AUTHORIZED)
    (asserts! (< burn-block-height (get end-time p)) ERR-NOT-AUTHORIZED)
    
    ;; prevent double voting
    (asserts! (is-none (map-get? proposal-votes { round: round, voter: tx-sender })) ERR-NOT-AUTHORIZED)

    (map-set proposal-votes { round: round, voter: tx-sender } { weight: bal, option: option })

    (let ((t (default-to u0 (map-get? proposal-results { round: round, option: option }))))
      (map-set proposal-results { round: round, option: option } (+ t bal))
    )

    (ok true)
  )
)

(define-read-only (get-post-boost (post (buff 32)))
  (match (map-get? post-boosts post)
    boost
      (if (< burn-block-height (get expiration boost))
          (get weight boost)
          u0)
    u0
  )
)

(define-read-only (is-ready)
  (ok (is-eq (var-get token-contract) .gm-token-v2))
)

(define-read-only (get-current-burn-height)
  (ok burn-block-height)
)