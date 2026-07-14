import { Head } from '@inertiajs/react';

const capabilities = [
  {
    title: 'Gestion des achats',
    description: 'Centralisez les demandes, validations et commandes fournisseurs.',
    icon: '🛒',
  },
  {
    title: 'Gestion des stocks',
    description: 'Suivi en temps réel des entrées, sorties et ruptures.',
    icon: '📦',
  },
  {
    title: 'Gestion des clients',
    description: 'Historique des clients et suivi des relations.',
    icon: '👥',
  },
  {
    title: 'Gestion des produits',
    description: 'Catalogue produit structuré et facile à maintenir.',
    icon: '🧾',
  },
  {
    title: 'Inventaires',
    description: 'Inventaires rapides et contrôlables à tout moment.',
    icon: '🔍',
  },
  {
    title: 'Transferts de stock',
    description: 'Synchronisez les mouvements entre agences.',
    icon: '🚚',
  },
  {
    title: 'Tableaux de bord',
    description: 'KPIs clairs pour piloter la performance.',
    icon: '📊',
  },
];

const modules = [
  { title: 'Produits', icon: '📦' },
  { title: 'Catégories', icon: '🗂️' },
  { title: 'Clients', icon: '👤' },
  { title: 'Stocks', icon: '🏬' },
  { title: 'Inventaires', icon: '📋' },
  { title: 'Demandes d’achat', icon: '📝' },
  { title: 'Transferts', icon: '🚛' },
  { title: 'Réservations', icon: '📅' },
  { title: 'Agences', icon: '🏢' },
];

const faqItems = [
  {
    question: 'Comment créer une demande d’achat ?', 
    answer: 'Cliquez sur le module “Demandes d’achat”, remplissez le formulaire puis validez la demande.',
  },
  {
    question: 'Comment contrôler les stocks ?',
    answer: 'Ouvrez le module “Stocks” et déclenchez un inventaire ou vérifiez les seuils de sécurité.',
  },
  {
    question: 'Comment gérer une agence ?',
    answer: 'Accédez au module “Agences” pour consulter les emplacements et les flux associés.',
  },
];

export default function Welcome() {
  return (
    <>
      <Head title="SUPDATA ERP" />

      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              <a href="#accueil" className="flex items-center gap-3">
                <SupdataLogo className="h-10 w-auto" />
                <span className="text-lg font-bold tracking-tight text-slate-950">
                  SUPDATA <span className="font-normal text-slate-600">ERP</span>
                </span>
              </a>
              <nav className="hidden items-center gap-6 text-sm text-slate-600 lg:flex">
                <a href="#accueil" className="transition hover:text-slate-900">Accueil</a>
                <a href="#capacites" className="transition hover:text-slate-900">Capacités</a>
                <a href="#modules" className="transition hover:text-slate-900">Modules</a>
                <a href="#workflow" className="transition hover:text-slate-900">Workflow</a>
                <a href="#faq" className="transition hover:text-slate-900">FAQ</a>
              </nav>
            </div>
            <a href="/dashboard" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">
              Se connecter
            </a>
          </div>
        </header>

        <main>
          <section id="accueil" className="bg-white">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
              <div className="flex flex-col justify-center gap-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  ERP interne moderne pour achats et stocks
                </div>
                <div>
                  <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                    Centralisez la gestion de vos achats et de vos stocks
                  </h1>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                    SUPDATA ERP simplifie le suivi des achats, la gestion des stocks, les inventaires et les transferts depuis une seule plateforme.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <a href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/10 transition hover:bg-slate-800">
                    Découvrir la plateforme
                  </a>
                  <a href="#modules" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                    Voir les modules
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Produits suivis</p>
                    <p className="mt-4 text-3xl font-bold text-slate-950">25k+</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Demandes d’achat</p>
                    <p className="mt-4 text-3xl font-bold text-slate-950">12k+</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Clients</p>
                    <p className="mt-4 text-3xl font-bold text-slate-950">8k+</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Agences</p>
                    <p className="mt-4 text-3xl font-bold text-slate-950">45+</p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-cyan-100 to-transparent" />
                <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl shadow-slate-900/20 ring-1 ring-white/10">
                  <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80" alt="Tableau de bord ERP" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </section>

          <section id="capacites" className="bg-slate-50 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Capacités centrales</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Des outils puissants pour optimiser votre chaîne d’approvisionnement
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Une gestion complète des achats, stocks, clients et transferts depuis un espace intuitif et centralisé.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {capabilities.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-2xl">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="modules" className="bg-slate-950 px-6 py-16 text-white lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Modules de l’entreprise</p>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Modules complets pour piloter votre activité
                  </h2>
                </div>
                <p className="max-w-xl text-sm text-slate-300">
                  Une solution modulaire pour gérer achats, stocks, inventaires, transferts et agences depuis une seule plateforme.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {modules.map((module) => (
                  <div key={module.title} className="rounded-3xl border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:bg-slate-800/95">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-xl">
                      {module.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="workflow" className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Flux de travail optimisé</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Un processus fluide pour chaque étape opérationnelle
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-5">
                {[
                  'Création de la demande',
                  'Validation et planification',
                  'Suivi des stocks en temps réel',
                  'Livraison et transfert',
                  'Rapport de performance',
                ].map((label, index) => (
                  <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-xl font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm font-semibold text-slate-950">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-slate-900 px-6 py-16 text-white lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
              <div className="flex flex-col justify-center gap-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Pilotez votre activité</p>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Une interface unique pour superviser tout votre ERP
                </h2>
                <p className="max-w-xl text-lg leading-8 text-slate-300">
                  Accédez à vos indicateurs, mouvements de stock et performances agences depuis un tableau de bord clair et intuitif.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-[2rem] bg-white/5 p-4 shadow-2xl shadow-slate-950/30 ring-1 ring-white/10">
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" alt="Dashboard ERP" className="h-full w-full rounded-[1.5rem] object-cover" />
              </div>
            </div>
          </section>

          <section className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2">
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Pourquoi choisir SUPDATA</p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Une solution pensée pour les équipes opérationnelles
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>Un tableau de bord centralisé, un suivi des stocks automatisé et une gestion des demandes adaptée à vos processus.</p>
                  <p>Une plateforme sécurisée pour garder le contrôle sur vos achats, transferts et agences.</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Saisie en temps réel</p>
                  <p className="mt-3 text-base leading-7 text-slate-700">Visualisez immédiatement les mouvements de stock et les validations en cours.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Réduction des erreurs</p>
                  <p className="mt-3 text-base leading-7 text-slate-700">Evitez les ruptures et doublons grâce à un suivi centralisé et des alertes intelligentes.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="bg-slate-50 px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Questions fréquemment posées</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Tout est clair et accessible</h2>
              </div>
              <div className="space-y-4">
                {faqItems.map((faq) => (
                  <div key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-slate-950">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-10 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-base font-semibold text-slate-950">SUPDATA ERP</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">Une solution moderne pour centraliser la gestion des achats, du stock et des agences.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-600">
              <a href="#accueil" className="transition hover:text-slate-900">Accueil</a>
              <a href="#capacites" className="transition hover:text-slate-900">Capacités</a>
              <a href="#modules" className="transition hover:text-slate-900">Modules</a>
              <a href="#faq" className="transition hover:text-slate-900">FAQ</a>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">© 2026 SUPDATA ERP. Tous droits réservés.</div>
        </footer>
      </div>
    </>
  );
}
