;; Gm Social Protocol - On-Chain Reputation & Social Graph (Clarity v2)

;; Data Maps
(define-map users
    principal
    {
        last-gm: uint,
        streak: uint,
        points: uint,
        username: (optional (string-utf8 20))
    }
)

(define-map usernames
    (string-utf8 20)
    principal
)

;; Public Functions

;; @desc Say GM - Increments streak and adds 50 points
(define-public (say-gm)
  (let (
        ;; constants moved inside function
        (COOLDOWN-BLOCKS u144) ;; ~24 hours
        (GRACE-PERIOD-BLOCKS u288) ;; ~48 hours
        (ERR-COOLDOWN-ACTIVE (err u101))
        (ERR-NOT-AUTHORIZED (err u100))
        
        ;; user data
        (user-data (default-to 
            { last-gm: u0, streak: u0, points: u0, username: none } 
            (map-get? users tx-sender)
        ))
        
        (current-height burn-block-height)
        (blocks-passed (- current-height (get last-gm user-data)))
    )
    
    ;; 1. Check if 24h passed
    (asserts! (or (is-eq (get last-gm user-data) u0) (> blocks-passed COOLDOWN-BLOCKS)) ERR-COOLDOWN-ACTIVE)

    ;; 2. Logic for streak
    (let (
            (new-streak (if (< blocks-passed GRACE-PERIOD-BLOCKS)
                (+ (get streak user-data) u1)
                u1 ;; Reset streak if missed grace period
            ))
            (new-points (+ (get points user-data) u50))
        )
        (map-set users tx-sender
            (merge user-data {
                last-gm: current-height,
                streak: new-streak,
                points: new-points
            })
        )
        (ok { streak: new-streak, points: new-points })
    )
  )
)

;; @desc Set a permanent on-chain username
(define-public (set-username (new-name (string-utf8 20)))
  (let (
        ;; constants moved inside function
        (ERR-INVALID-NAME (err u104))
        (ERR-ALREADY-SET (err u103))
        (ERR-USERNAME-TAKEN (err u102))

        ;; user data
        (user-data (default-to 
            { last-gm: u0, streak: u0, points: u0, username: none } 
            (map-get? users tx-sender)
        ))
    )
    
    ;; 1. Name must be > 2 chars
    (asserts! (>= (len new-name) u3) ERR-INVALID-NAME)
    ;; 2. User must not already have a name
    (asserts! (is-none (get username user-data)) ERR-ALREADY-SET)
    ;; 3. Name must not be taken
    (asserts! (is-none (map-get? usernames new-name)) ERR-USERNAME-TAKEN)

    ;; 4. Update maps
    (map-set usernames new-name tx-sender)
    (map-set users tx-sender (merge user-data { username: (some new-name) }))
    (ok true)
  )
)

;; Read-Only Functions

(define-read-only (get-user-data (user principal))
  (ok (default-to 
        { last-gm: u0, streak: u0, points: u0, username: none } 
        (map-get? users user)
  ))
)

(define-read-only (get-address-by-username (name (string-utf8 20)))
  (ok (map-get? usernames name))
)