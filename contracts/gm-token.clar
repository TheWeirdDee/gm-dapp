;; $GM Token - SIP-010 Fungible Token for GM Social Protocol
;; (impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Errors
(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-INVALID-AMOUNT (err u400))

;; Constants
(define-constant TOKEN-NAME "GM Social Token")
(define-constant TOKEN-SYMBOL "GM")
(define-constant TOKEN-DECIMALS u6)

;; Governance
(define-data-var governor principal tx-sender)

;; Token Definitions
(define-fungible-token gm-token)

;; Public Functions

;; @desc Transfer tokens - Standard SIP-010
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (try! (ft-transfer? gm-token amount sender recipient))
    (match memo to-print (begin (print to-print) true) true)
    (ok true)
  )
)

;; @desc Mint tokens - Restricted to the Protocol Governor (GM Social Contract)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get governor)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (ft-mint? gm-token amount recipient)
  )
)

;; @desc Burn tokens - Restricted to the Protocol Governor
(define-public (burn (amount uint) (sender principal))
  (begin
    (asserts! (is-eq tx-sender (var-get governor)) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (ft-burn? gm-token amount sender)
  )
)

;; @desc Update Governor - Allows the Protocol to evolve
(define-public (set-governor (new-governor principal))
  (begin
    (asserts! (is-eq tx-sender (var-get governor)) ERR-NOT-AUTHORIZED)
    (var-set governor new-governor)
    (ok true)
  )
)

;; Read-Only Functions

(define-read-only (get-name)
  (ok TOKEN-NAME)
)

(define-read-only (get-symbol)
  (ok TOKEN-SYMBOL)
)

(define-read-only (get-decimals)
  (ok TOKEN-DECIMALS)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance gm-token who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply gm-token))
)

(define-read-only (get-token-uri)
  (ok none)
)

(define-read-only (get-governor)
  (ok (var-get governor))
)
