import { Container } from "./Container"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg/95 backdrop-blur">
      <Container>
        <div className="py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
                  <span className="text-brand-foreground font-bold text-lg">C</span>
                </div>
                <span className="text-h3 text-text-primary">Cakto</span>
              </div>
              <p className="text-text-secondary text-sm">O checkout mais inteligente do Brasil. Taxa 0% no PIX.</p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-semibold text-text-primary">Produto</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Taxas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Integrações
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Documentação
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-semibold text-text-primary">Empresa</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Carreiras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-text-primary">Suporte</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Central de ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Termos de uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-text-primary transition-colors">
                    Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-text-secondary text-sm">© 2024 Cakto. Todos os direitos reservados.</p>
            <div className="flex items-center space-x-6 text-sm text-text-secondary">
              <a href="#" className="hover:text-text-primary transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-text-primary transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
