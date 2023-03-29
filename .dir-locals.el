;; You should also update your eslint language server so that you get a new
;; instance per workspace -- we can't use the same eslint server for both
;; server/ and packages/*.
;; (setf (lsp--client-multi-root (gethash 'eslint lsp-clients)) nil)

(
 (typescript-mode
  . (
     (eval . (let ((project-directory (car (dir-locals-find-file default-directory))))
               (setq-local lsp-eslint-working-directories (vector "."))
               (setq-local lsp-eslint-node-path (concat project-directory ".yarn/sdks"))
               (setq-local lsp-clients-typescript-server-args `("--tsserver-path" ,(concat project-directory ".yarn/sdks/typescript/bin/tsserver") "--stdio"))
               ))
     (typescript-indent-level . 2))))
