/* =========================================
   ACHADINHOS DA LILU – script.js
   =========================================
   COMO ADICIONAR UM PRODUTO:
   1. Copie um objeto do array `produtos` abaixo
   2. Preencha os campos (veja comentários)
   3. Salve o arquivo — o produto aparece automaticamente!
   ========================================= */

/* ──────────────────────────────────────────
   BASE DE PRODUTOS
   ──────────────────────────────────────────
   Campos disponíveis:
   · id        : número único
   · nome      : nome do produto (texto)
   · descricao : descrição curta
   · categoria : beleza | perfume | moda | casa | cozinha
                 eletronicos | decoracao | utilidades | presentes | promocao
   · imagem    : URL da imagem (use Unsplash, Mercado Livre, etc.)
   · link      : ← SEU LINK DE AFILIADO AQUI
   · badge     : 'Promoção' | 'Novo' | 'Destaque' | '' (vazio = sem badge)
   · oferta    : true (aparece em "Ofertas do Dia") | false
   · precoAntigo : 'R$ 149,90' (opcional, só para cards de oferta)
   · precoNovo   : 'R$ 89,90'  (opcional, só para cards de oferta)
   ────────────────────────────────────────── */
const produtos = [

  /* ───────── BELEZA ───────── */
  {
    id: 1,
    nome: 'Kit Skincare Completo',
    descricao: 'Rotina de cuidados com a pele: limpador, tônico, sérum e hidratante. Para pele radiante todos os dias!',
    categoria: 'beleza',
    imagem: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    link: 'https://www.amazon.com.br/', /* ← Insira seu link aqui */
    badge: 'Destaque',
    oferta: true,
    precoAntigo: 'R$ 219,00',
    precoNovo: 'R$ 139,90',
  },
  {
    id: 2,
    nome: 'Esponja de Silicone Facial',
    descricao: 'Limpeza profunda dos poros, remove maquiagem com suavidade. Durável e fácil de higienizar.',
    categoria: 'beleza',
    imagem: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Novo',
    oferta: false,
  },
  {
    id: 3,
    nome: 'Paleta de Sombras 35 Cores',
    descricao: 'Cores vibrantes e matte, altamente pigmentadas. Ideal para maquiagens do dia e da noite.',
    categoria: 'beleza',
    imagem: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Promoção',
    oferta: true,
    precoAntigo: 'R$ 89,00',
    precoNovo: 'R$ 49,90',
  },

  /* ───────── PERFUME ───────── */
  {
    id: 4,
    nome: 'Eau de Parfum Floral',
    descricao: 'Fragrância delicada com notas de rosa, jasmim e almíscar. Duração de até 8 horas.',
    categoria: 'perfume',
    imagem: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Destaque',
    oferta: true,
    precoAntigo: 'R$ 320,00',
    precoNovo: 'R$ 199,00',
  },
  {
    id: 5,
    nome: 'Body Mist Tropical',
    descricao: 'Perfume corporal refrescante com notas cítricas de coco, abacaxi e baunilha suave.',
    categoria: 'perfume',
    imagem: 'https://images.unsplash.com/photo-1592945403407-9caf930b9e63?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: '',
    oferta: false,
  },

  /* ───────── MODA ───────── */
  {
    id: 6,
    nome: 'Bolsa Tote Premium',
    descricao: 'Bolsa espaçosa em couro sintético de alta qualidade. Perfeita para o dia a dia e trabalho.',
    categoria: 'moda',
    imagem: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Destaque',
    oferta: false,
  },
  {
    id: 7,
    nome: 'Conjunto Loungewear Rose',
    descricao: 'Conjunto calça e blusa em ribana macia. Ultra confortável para ficar em casa com estilo.',
    categoria: 'moda',
    imagem: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Novo',
    oferta: true,
    precoAntigo: 'R$ 159,90',
    precoNovo: 'R$ 99,90',
  },
  {
    id: 8,
    nome: 'Óculos de Sol Cat Eye',
    descricao: 'Armação gatinho retrô com proteção UV400. Um acessório que transforma qualquer look.',
    categoria: 'moda',
    imagem: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Promoção',
    oferta: false,
  },

  /* ───────── CASA ───────── */
  {
    id: 9,
    nome: 'Jogo de Cama Queen Luxo',
    descricao: 'Lençol + 2 fronhas em microfibra 400 fios. Toque macio e cor que não desbota.',
    categoria: 'casa',
    imagem: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Destaque',
    oferta: true,
    precoAntigo: 'R$ 199,00',
    precoNovo: 'R$ 129,90',
  },
  {
    id: 10,
    nome: 'Difusor de Aromas Premium',
    descricao: 'Umidificador ultrassônico com LED colorido. Deixa o ambiente com cheiro incrível.',
    categoria: 'casa',
    imagem: 'https://images.unsplash.com/photo-1585652757173-e31b8a98c6cf?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Novo',
    oferta: false,
  },

  /* ───────── COZINHA ───────── */
  {
    id: 11,
    nome: 'Fritadeira Air Fryer 4L',
    descricao: 'Frite, asse e grelhe com até 80% menos óleo. Display digital, 8 funções, timer até 30 min.',
    categoria: 'cozinha',
    imagem: 'https://images.unsplash.com/photo-1643576736019-ffa0572bbb0b?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Promoção',
    oferta: true,
    precoAntigo: 'R$ 549,00',
    precoNovo: 'R$ 369,00',
  },
  {
    id: 12,
    nome: 'Jogo de Panelas Antiaderente',
    descricao: '5 peças em cerâmica antiaderente livre de PFOA. Tampa de vidro, cabo ergonômico.',
    categoria: 'cozinha',
    imagem: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: '',
    oferta: false,
  },

  /* ───────── ELETRÔNICOS ───────── */
  {
    id: 13,
    nome: 'Fone Bluetooth com ANC',
    descricao: 'Cancelamento de ruído ativo, 30h de bateria, áudio Hi-Fi. Conexão rápida e confortável.',
    categoria: 'eletronicos',
    imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Destaque',
    oferta: true,
    precoAntigo: 'R$ 499,00',
    precoNovo: 'R$ 299,00',
  },
  {
    id: 14,
    nome: 'Carregador Wireless 15W',
    descricao: 'Carregamento rápido por indução. Compatível com iPhone e Android. Design minimalista.',
    categoria: 'eletronicos',
    imagem: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Novo',
    oferta: false,
  },

  /* ───────── DECORAÇÃO ───────── */
  {
    id: 15,
    nome: 'Quadro Decorativo Minimalista',
    descricao: 'Arte em tela com moldura premium. Frase inspiradora em lettering. 40x60 cm.',
    categoria: 'decoracao',
    imagem: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: '',
    oferta: false,
  },
  {
    id: 16,
    nome: 'Vaso Marmorizado Trio',
    descricao: 'Conjunto de 3 vasos em resina com efeito mármore. Perfeito para plantas ou decoração.',
    categoria: 'decoracao',
    imagem: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Novo',
    oferta: false,
  },

  /* ───────── UTILIDADES ───────── */
  {
    id: 17,
    nome: 'Organizador de Gaveta 12 Pç',
    descricao: 'Divisórias modulares em acrílico. Mantenha meias, lingerie e acessórios organizados.',
    categoria: 'utilidades',
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: '',
    oferta: false,
  },
  {
    id: 18,
    nome: 'Garrafa Térmica 750ml',
    descricao: 'Mantém bebidas quentes 12h e geladas 24h. Aço inox, tampa travada, sem BPA.',
    categoria: 'utilidades',
    imagem: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Destaque',
    oferta: false,
  },

  /* ───────── PRESENTES ───────── */
  {
    id: 19,
    nome: 'Kit Presente Spa em Casa',
    descricao: 'Vela aromática + máscara facial + toalhinha + sais de banho. Embalagem presente linda!',
    categoria: 'presentes',
    imagem: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Destaque',
    oferta: true,
    precoAntigo: 'R$ 180,00',
    precoNovo: 'R$ 119,90',
  },
  {
    id: 20,
    nome: 'Caixa Surpresa Deluxe',
    descricao: 'Caixa com 5 produtos selecionados: beleza, bem-estar e lifestyle. Ideal para presentear.',
    categoria: 'presentes',
    imagem: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Novo',
    oferta: false,
  },

  /* ───────── PROMOÇÕES ───────── */
  {
    id: 21,
    nome: 'Liquidificador 1000W',
    descricao: 'Copo de acrílico resistente, 5 velocidades + pulsar. Para vitaminas, smoothies e muito mais.',
    categoria: 'promocao',
    imagem: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Promoção',
    oferta: true,
    precoAntigo: 'R$ 249,00',
    precoNovo: 'R$ 149,90',
  },
  {
    id: 22,
    nome: 'Escova Alisadora Íon',
    descricao: 'Temperatura até 230°C, revestimento cerâmico, íons para reduzir frizz. Fica pronta em 30s.',
    categoria: 'promocao',
    imagem: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80',
    link: 'https://www.amazon.com.br/',
    badge: 'Promoção',
    oferta: true,
    precoAntigo: 'R$ 199,00',
    precoNovo: 'R$ 119,00',
  },

];
/* ────────────────────────────────────────────
   FIM DA BASE DE PRODUTOS
   Para adicionar mais: copie um objeto acima,
   incremente o id e preencha os campos.
   ──────────────────────────────────────────── */


/* ─────────────────────────────
   ESTADO DA APLICAÇÃO
───────────────────────────── */
let filtroAtivo    = 'todos';
let termoBusca     = '';


/* ─────────────────────────────
   UTILITÁRIOS
───────────────────────────── */

/**
 * Retorna a classe CSS do badge com base no texto.
 */
function classBadge(badge) {
  const map = {
    'Promoção':  'badge-promo',
    'Novo':      'badge-novo',
    'Destaque':  'badge-destaque',
  };
  return map[badge] || 'badge-destaque';
}

/**
 * Escapa caracteres HTML para evitar XSS.
 */
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Normaliza string para busca (remove acentos, lowercase).
 */
function normalizar(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}


/* ─────────────────────────────
   RENDERIZAÇÃO – CARD OFERTA
───────────────────────────── */
function renderOfertaCard(p) {
  return `
    <article class="oferta-card" data-id="${p.id}">
      <div class="oferta-card-img-wrap">
        <img
          class="oferta-card-img"
          src="${esc(p.imagem)}"
          alt="${esc(p.nome)}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80'"
        />
        <div class="badge-hot">🔥 Oferta</div>
      </div>
      <div class="oferta-card-body">
        <div class="oferta-card-cat">${esc(p.categoria.toUpperCase())}</div>
        <h3 class="oferta-card-name">${esc(p.nome)}</h3>
        <p class="oferta-card-desc">${esc(p.descricao)}</p>
        <div class="oferta-card-footer">
          ${p.precoAntigo && p.precoNovo ? `
            <div class="price-tag">
              <span class="price-old">${esc(p.precoAntigo)}</span>
              <span class="price-new">${esc(p.precoNovo)}</span>
            </div>
          ` : ''}
          <a
            href="${esc(p.link)}"
            target="_blank"
            rel="noopener nofollow sponsored"
            class="btn-offer"
            aria-label="Ver oferta de ${esc(p.nome)}"
          >
            Ver Oferta <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    </article>
  `;
}


/* ─────────────────────────────
   RENDERIZAÇÃO – CARD PRODUTO
───────────────────────────── */
function renderProdutoCard(p, delay = 0) {
  const badgeHtml = p.badge
    ? `<div class="product-badge ${classBadge(p.badge)}">${esc(p.badge)}</div>`
    : '';

  return `
    <article
      class="product-card"
      data-id="${p.id}"
      data-cat="${esc(p.categoria)}"
      style="animation-delay:${delay}ms"
    >
      <div class="product-card-img-wrap">
        <img
          class="product-card-img"
          src="${esc(p.imagem)}"
          alt="${esc(p.nome)}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80'"
        />
        ${badgeHtml}
      </div>
      <div class="product-card-body">
        <div class="product-card-cat">${esc(p.categoria.toUpperCase())}</div>
        <h3 class="product-card-name">${esc(p.nome)}</h3>
        <p class="product-card-desc">${esc(p.descricao)}</p>
        <div class="product-card-footer">
          <a
            href="${esc(p.link)}"
            target="_blank"
            rel="noopener nofollow sponsored"
            class="btn-offer"
            aria-label="Ver oferta de ${esc(p.nome)}"
          >
            Ver Oferta <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </article>
  `;
}


/* ─────────────────────────────
   FILTRAR E RENDERIZAR PRODUTOS
───────────────────────────── */
function filtrarProdutos() {
  const busca = normalizar(termoBusca);

  return produtos.filter(p => {
    // Filtro de categoria
    const catOk = filtroAtivo === 'todos' || p.categoria === filtroAtivo;

    // Filtro de busca (nome, descrição, categoria)
    const buscaOk = !busca || [p.nome, p.descricao, p.categoria]
      .some(campo => normalizar(campo).includes(busca));

    return catOk && buscaOk;
  });
}

function renderProdutos() {
  const grid       = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptyState');
  const resultCount = document.getElementById('resultCount');

  const lista = filtrarProdutos();

  if (lista.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    resultCount.textContent = 'Nenhum produto encontrado';
    return;
  }

  emptyState.style.display = 'none';

  const total = lista.length;
  const texto = termoBusca
    ? `${total} resultado${total !== 1 ? 's' : ''} para "${termoBusca}"`
    : filtroAtivo !== 'todos'
      ? `${total} produto${total !== 1 ? 's' : ''} em "${filtroAtivo}"`
      : `Mostrando todos os ${total} produtos`;

  resultCount.textContent = texto;

  grid.innerHTML = lista
    .map((p, i) => renderProdutoCard(p, i * 40))
    .join('');
}

function renderOfertas() {
  const grid  = document.getElementById('ofertasGrid');
  const lista = produtos.filter(p => p.oferta);
  grid.innerHTML = lista.map(p => renderOfertaCard(p)).join('');
}


/* ─────────────────────────────
   RESET DE FILTROS
───────────────────────────── */
function resetFilters() {
  filtroAtivo = 'todos';
  termoBusca  = '';

  // Atualiza input
  const input = document.getElementById('searchInput');
  if (input) input.value = '';

  // Atualiza botão limpar
  atualizarBotaoLimpar();

  // Atualiza categoria ativa
  document.querySelectorAll('.cat-card').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === 'todos');
  });

  renderProdutos();
}


/* ─────────────────────────────
   BOTÃO LIMPAR BUSCA
───────────────────────────── */
function atualizarBotaoLimpar() {
  const btn = document.getElementById('searchClear');
  if (btn) {
    btn.classList.toggle('visible', termoBusca.length > 0);
  }
}


/* ─────────────────────────────
   EVENT LISTENERS
───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Render inicial
  renderOfertas();
  renderProdutos();

  /* ── BUSCA ── */
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      termoBusca = searchInput.value.trim();
      atualizarBotaoLimpar();
      renderProdutos();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      termoBusca = '';
      searchInput.value = '';
      atualizarBotaoLimpar();
      renderProdutos();
    });
  }

  /* ── SEARCH TAGS ── */
  document.querySelectorAll('.search-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const termo = tag.dataset.tag;
      if (searchInput) searchInput.value = termo;
      termoBusca = termo;
      atualizarBotaoLimpar();
      renderProdutos();

      // Scroll suave para os produtos
      document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── FILTRO DE CATEGORIAS ── */
  document.querySelectorAll('.cat-card').forEach(btn => {
    btn.addEventListener('click', () => {
      filtroAtivo = btn.dataset.cat;

      // Toggle classe active
      document.querySelectorAll('.cat-card').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderProdutos();

      // Scroll suave para produtos
      document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── HEADER SCROLL ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
    scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  /* ── SCROLL TO TOP ── */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── MENU MOBILE ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      // Animação das barras do hamburger
      hamburger.classList.toggle('active');
    });

    // Fecha ao clicar em link
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  /* ── SMOOTH SCROLL interno ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── LAZY-LOAD com IntersectionObserver ── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .oferta-card').forEach(card => {
      card.style.animationPlayState = 'paused';
      observer.observe(card);
    });
  }

});

/* ──────────────────────────────
   COMO ADICIONAR PRODUTOS NOVOS
   ──────────────────────────────
   Exemplo mínimo de produto:

   {
     id: 23,
     nome: 'Meu Produto Incrível',
     descricao: 'Descrição curta e atrativa.',
     categoria: 'beleza',
     imagem: 'https://url-da-imagem.com/foto.jpg',
     link: 'https://meu-link-afiliado.com',
     badge: 'Novo',
     oferta: false,
   },

   Coloque dentro do array `produtos` acima, salve e pronto! 🎉
────────────────────────────── */
