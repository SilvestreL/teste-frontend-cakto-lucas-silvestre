"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "./Container"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "#taxas", label: "Taxas" },
    { href: "#integracoes", label: "Integrações" },
    { href: "#planos", label: "Planos" },
    { href: "#diferenciais", label: "Diferenciais" },
    { href: "#blog", label: "Blog" },
  ]

  return (
    <nav className="border-b border-border bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
              <span className="text-brand-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-h3 text-text-primary">Cakto</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-brand hover:bg-brand-hover text-brand-foreground">Criar minha conta</Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6 text-text-primary" /> : <Menu className="h-6 w-6 text-text-primary" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button className="bg-brand hover:bg-brand-hover text-brand-foreground w-full mt-4">
                Criar minha conta
              </Button>
            </div>
          </div>
        )}
      </Container>
    </nav>
  )
}
