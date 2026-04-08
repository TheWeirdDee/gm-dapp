;; Gm Social Protocol - Core Contract
;; Scalable social graph and engagement layer on Stacks

;; ---------------------------------------------------------
;; Constants & Types
;; ---------------------------------------------------------

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_NOT_FOUND (err u101))
(define-constant ERR_ALREADY_EXISTS (err u102))
(define-constant ERR_SPAM_LIMIT (err u103))

;; ---------------------------------------------------------
;; Maps (State)
;; ---------------------------------------------------------

;; Identity: maps principal to profile data
(define-map Identities
  principal
  {
    username: (string-ascii 24),
    avatar: (string-ascii 256),
    bio: (string-ascii 160),
    created-at: uint
  }
)

;; Engagement & Streaks
(define-map UserStats
  principal
  {
    streak: uint,
    points: uint,
    last-gm: uint,
    active: bool
  }
)

;; Social Graph: maps (user, follower) to status
(define-map SocialGraph
  { user: principal, follower: principal }
  { active: bool, Since: uint }
)

;; Posts Table
(define-map Posts
  uint
  {
    author: principal,
    content: (string-utf8 280),
    timestamp: uint,
    reactions-count: uint
  }
)

(define-data-var last-post-id uint u0)

;; ---------------------------------------------------------
;; Read-Only Functions
;; ---------------------------------------------------------

(define-read-only (get-user (user principal))
  (map-get? Identities user)
)

(define-read-only (get-streak (user principal))
  (default-to { streak: u0, points: u0, last-gm: u0, active: false } (map-get? UserStats user))
)

(define-read-only (get-post (id uint))
  (map-get? Posts id)
)

;; ---------------------------------------------------------
;; Public Functions - Identity
;; ---------------------------------------------------------

(define-public (set-username (name (string-ascii 24)))
  (let ((current-id (default-to { username: "", avatar: "", bio: "", created-at: block-height } (map-get? Identities tx-sender))))
    (ok (map-set Identities tx-sender (merge current-id { username: name })))
  )
)

(define-public (set-avatar (avatar (string-ascii 256)))
  (let ((current-id (default-to { username: "", avatar: "", bio: "", created-at: block-height } (map-get? Identities tx-sender))))
    (ok (map-set Identities tx-sender (merge current-id { avatar: avatar })))
  )
)

;; ---------------------------------------------------------
;; Public Functions - Engagement
;; ---------------------------------------------------------

(define-public (say-gm)
  (let (
    (stats (get-streak tx-sender))
    (current-height block-height)
    (last-gm (get last-gm stats))
    (current-streak (get streak stats))
  )
    ;; Logic for streak calculation (simplified for now)
    ;; In real production, we'd check if last-gm was within ~144 blocks (1 day on Stacks)
    (ok (map-set UserStats tx-sender {
      streak: (+ current-streak u1),
      points: (+ (get points stats) u50),
      last-gm: current-height,
      active: true
    }))
  )
)

;; ---------------------------------------------------------
;; Public Functions - Posts
;; ---------------------------------------------------------

(define-public (create-post (content (string-utf8 280)))
  (let ((new-id (+ (var-get last-post-id) u1)))
    (map-set Posts new-id {
      author: tx-sender,
      content: content,
      timestamp: block-height,
      reactions-count: u0
    })
    (var-set last-post-id new-id)
    (ok new-id)
  )
)

;; ---------------------------------------------------------
;; Public Functions - Social Graph
;; ---------------------------------------------------------

(define-public (follow (user principal))
  (ok (map-set SocialGraph { user: user, follower: tx-sender } { active: true, Since: block-height }))
)

(define-public (unfollow (user principal))
  (ok (map-delete SocialGraph { user: user, follower: tx-sender }))
)
