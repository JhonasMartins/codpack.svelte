<script>
  import { Button } from '$lib/components/ui/button/index.js'
  import { Copy, Eye, Star, Bell, User, Settings, HelpCircle, LogOut, Download } from '@lucide/svelte'

  // Estado do dropdown do avatar
  let showDropdown = false
  let showNotificationDropdown = false
  
  function toggleDropdown() {
    showDropdown = !showDropdown
    showNotificationDropdown = false
  }
  
  function toggleNotificationDropdown() {
    showNotificationDropdown = !showNotificationDropdown
    showDropdown = false
  }
  
  function closeDropdown() {
    showDropdown = false
    showNotificationDropdown = false
  }
  
  // Funções do dropdown
  function goToProfile() {
    console.log('Ir para perfil')
    closeDropdown()
  }
  
  function goToSupport() {
    console.log('Ir para suporte')
    closeDropdown()
  }
  
  function logout() {
    console.log('Sair da conta')
    closeDropdown()
  }

  // Usuário logado (placeholder). Integre com sua auth futuramente
  let user = { name: 'Jhonas' }

  // Gerador de imagens SVG como data URL para manter layout 100% baseado em imagens
  function svgThumb(label, colors = ['#111827', '#1f2937']) {
    const [c1, c2] = colors
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${c1}'/>
          <stop offset='100%' stop-color='${c2}'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' rx='24' fill='url(#g)'/>
      <g fill='none' stroke='rgba(255,255,255,0.12)'>
        <rect x='40' y='40' width='720' height='420' rx='16' />
        <rect x='60' y='80' width='200' height='120' rx='12' />
        <rect x='300' y='80' width='440' height='60' rx='8' />
        <rect x='300' y='160' width='320' height='40' rx='8' />
      </g>
      <text x='50%' y='90%' text-anchor='middle' font-size='36' font-family='system-ui, sans-serif' fill='white' opacity='0.9'>${label}</text>
    </svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  // Dados de exemplo (substitua por dados reais da sua API)
  const cores = [
    ['#0f172a', '#1e293b'],
    ['#111827', '#1f2937'],
    ['#0b132b', '#1c2541'],
    ['#0a0a0a', '#171717'],
    ['#0a192f', '#112240'],
    ['#111827', '#374151'],
  ]

  const secoes = Array.from({ length: 8 }, (_, i) => ({
    id: `sec-${i + 1}`,
    title: `Seção ${i + 1}`,
    img: svgThumb(`Seção ${i + 1}`, cores[i % cores.length])
  }))
  const paginas = Array.from({ length: 8 }, (_, i) => ({
    id: `pag-${i + 1}`,
    title: `Página ${i + 1}`,
    img: svgThumb(`Página ${i + 1}`, cores[(i + 1) % cores.length])
  }))
  const codigos = Array.from({ length: 8 }, (_, i) => ({
    id: `css-${i + 1}`,
    title: `CSS ${i + 1}`,
    img: svgThumb(`CSS ${i + 1}`, cores[(i + 2) % cores.length])
  }))
  const mockups = Array.from({ length: 8 }, (_, i) => ({
    id: `mkp-${i + 1}`,
    title: `Mockup ${i + 1}`,
    img: svgThumb(`Mockup ${i + 1}`, cores[(i + 3) % cores.length])
  }))
  const plugins = Array.from({ length: 8 }, (_, i) => ({
    id: `plg-${i + 1}`,
    title: `Plugin ${i + 1}`,
    img: svgThumb(`Plugin ${i + 1}`, cores[(i + 4) % cores.length])
  }))

  // Favoritos
  let favorites = new Set()
  function toggleFavorite(id) {
    const next = new Set(favorites)
    if (next.has(id)) next.delete(id); else next.add(id)
    favorites = next
  }
  function isFav(id) { return favorites.has(id) }

  async function onCopy(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      console.error('Falha ao copiar', e)
    }
  }
  function onView(url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Download para Mockups e Plugins
  function downloadDataUrl(dataUrl, filename = 'download.svg') {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  function onDownload(item) {
    try {
      if (item?.downloadUrl) {
        const a = document.createElement('a')
        a.href = item.downloadUrl
        a.download = (item.title?.replaceAll(' ', '_').toLowerCase() || 'download')
        document.body.appendChild(a)
        a.click()
        a.remove()
        return
      }
      if (item?.img && typeof item.img === 'string' && item.img.startsWith('data:')) {
        const filename = `${(item.title || 'download')}.svg`
        downloadDataUrl(item.img, filename)
        return
      }
      if (item?.img) {
        const a = document.createElement('a')
        a.href = item.img
        a.target = '_blank'
        a.rel = 'noopener'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    } catch (e) {
      console.error('Falha ao iniciar download', e)
    }
  }

  const sections = [
    { key: 'secoes', label: 'Seções', items: secoes },
    { key: 'paginas', label: 'Páginas', items: paginas },
    { key: 'codigos', label: 'Códigos CSS', items: codigos },
    { key: 'mockups', label: 'Mockups', items: mockups },
    { key: 'plugins', label: 'Plugins', items: plugins },
  ]

  // Novo estado para página de detalhes
  let currentView = 'home'
  let selectedItem = null
  let selectedType = null
  let commentsById = {}
  let commentInput

  function openDetail(item, type) {
    selectedType = type
    selectedItem = {
      ...item,
      type,
      name: item.title,
      description: `Este ${type === 'codigos' ? 'snippet CSS' : type === 'paginas' ? 'layout de página' : type === 'mockups' ? 'mockup' : type === 'plugins' ? 'plugin' : 'bloco de seção'} é um exemplo gerado localmente para demonstração.`,
      tags: type === 'codigos' ? ['css', 'utilitário', 'layout'] : type === 'paginas' ? ['landing', 'marketing'] : type === 'mockups' ? ['mockup', 'protótipo', 'ui'] : type === 'plugins' ? ['plugin', 'widget', 'elementor'] : ['hero', 'grid', 'cta'],
      copyText: item.title
    }
    currentView = 'detail'
    closeDropdown()
  }

  function goBack() {
    currentView = 'home'
  }

  function addComment(text) {
    if (!text || !selectedItem) return
    const id = selectedItem.id
    const list = commentsById[id] ? [...commentsById[id]] : []
    list.push({ text, date: new Date().toISOString() })
    commentsById = { ...commentsById, [id]: list }
  }

  function getComments() {
    return selectedItem && commentsById[selectedItem.id] ? commentsById[selectedItem.id] : []
  }

  // View de lista (páginas dedicadas)
  let selectedListType = null
  let listQuery = ''
  let listOnlyFavorites = false

  function openList(type) {
    selectedListType = type
    listQuery = ''
    listOnlyFavorites = false
    currentView = 'list'
  }

  function getListLabel() {
    const sec = sections.find(s => s.key === selectedListType)
    return sec ? sec.label : ''
  }

  function getListItems() {
    const sec = sections.find(s => s.key === selectedListType)
    let items = sec ? sec.items : []
    if (listQuery && listQuery.trim()) {
      const q = listQuery.trim().toLowerCase()
      items = items.filter(it => it.title.toLowerCase().includes(q))
    }
    if (listOnlyFavorites) {
      items = items.filter(it => isFav(it.id))
    }
    return items
  }
</script>

<div class="h-screen w-full overflow-hidden grid" style="grid-template-rows: 56px 1fr; grid-template-columns: 64px 1fr;" on:click={closeDropdown}>
  <!-- Navbar -->
  <header class="row-start-1 col-start-1 col-span-2 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60 relative z-[10000]">
    <div class="h-14 flex items-center justify-between px-4">
      <!-- Logo -->
      <button class="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary rounded-md" on:click={goBack} aria-label="Ir para a página inicial">
      <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
      <span class="text-primary-foreground font-bold text-sm">C</span>
      </div>
      <span class="font-semibold text-lg">Codpack</span>
      </button>
      
      <!-- Lado direito: Notificações + Avatar -->
      <div class="flex items-center gap-3">
        <!-- Ícone de notificações -->
        <div class="relative">
          <button 
            class="relative p-2 hover:bg-accent rounded-lg transition-colors"
            on:click|stopPropagation={toggleNotificationDropdown}
            title="Notificações"
          >
            <Bell class="w-5 h-5" />
            <!-- Badge de notificação -->
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-bold">3</span>
            </div>
          </button>
          
          <!-- Dropdown de Notificações -->
          {#if showNotificationDropdown}
            <div class="absolute right-0 top-full mt-2 w-80 bg-popover border rounded-lg shadow-lg z-[9999]" on:click|stopPropagation>
              <div class="p-3 border-b">
                <h3 class="font-semibold text-sm">Notificações</h3>
              </div>
              
              <div class="max-h-64 overflow-y-auto">
                <div class="p-3 border-b hover:bg-accent/50 cursor-pointer">
                  <div class="flex items-start gap-3">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium">Novo código disponível</p>
                      <p class="text-xs text-muted-foreground mt-1">Um novo snippet foi adicionado à sua coleção</p>
                      <p class="text-xs text-muted-foreground mt-1">2 min atrás</p>
                    </div>
                  </div>
                </div>
                
                <div class="p-3 border-b hover:bg-accent/50 cursor-pointer">
                  <div class="flex items-start gap-3">
                    <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium">Backup concluído</p>
                      <p class="text-xs text-muted-foreground mt-1">Seus códigos foram salvos com sucesso</p>
                      <p class="text-xs text-muted-foreground mt-1">1 hora atrás</p>
                    </div>
                  </div>
                </div>
                
                <div class="p-3 hover:bg-accent/50 cursor-pointer">
                  <div class="flex items-start gap-3">
                    <div class="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div class="flex-1">
                      <p class="text-sm font-medium">Atualização disponível</p>
                      <p class="text-xs text-muted-foreground mt-1">Nova versão do Codpack está disponível</p>
                      <p class="text-xs text-muted-foreground mt-1">3 horas atrás</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="p-2 border-t bg-muted/30">
                <div class="flex gap-2">
                  <button 
                    class="flex-1 px-3 py-2 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    on:click={() => console.log('Ler tudo')}
                  >
                    Ler tudo
                  </button>
                  <button 
                    class="flex-1 px-3 py-2 text-xs border rounded-md hover:bg-accent transition-colors"
                    on:click={() => console.log('Excluir')}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          {/if}
        </div>
        
        <!-- Avatar com dropdown -->
        <div class="relative">
          <button 
             class="flex items-center gap-2 p-1 hover:bg-accent rounded-lg transition-colors"
             on:click|stopPropagation={toggleDropdown}
             title="Menu do usuário"
           >
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User class="w-4 h-4 text-white" />
            </div>
            <span class="text-sm font-medium hidden sm:block">{user.name}</span>
          </button>
          
          <!-- Dropdown -->
           {#if showDropdown}
             <div class="absolute right-0 top-full mt-2 w-48 bg-popover border rounded-lg shadow-lg z-[9999]" on:click|stopPropagation>
              <div class="p-2">
                <button 
                  class="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors text-left"
                  on:click={goToProfile}
                >
                  <Settings class="w-4 h-4" />
                  Perfil
                </button>
                <button 
                  class="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors text-left"
                  on:click={goToSupport}
                >
                  <HelpCircle class="w-4 h-4" />
                  Suporte
                </button>
                <hr class="my-2 border-border" />
                <button 
                  class="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors text-left"
                  on:click={logout}
                >
                  <LogOut class="w-4 h-4" />
                  Sair da conta
                </button>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </header>

  <!-- Sidebar fino -->
  <aside class="row-start-2 col-start-1 border-r bg-sidebar text-sidebar-foreground">
    <div class="flex h-full w-16 flex-col items-center py-3 gap-3">
      <div class="size-9 rounded-md bg-muted" title="Início"></div>
      <div class="size-9 rounded-md bg-muted" title="Biblioteca"></div>
      <div class="size-9 rounded-md bg-muted" title="Busca"></div>
      <div class="mt-auto size-9 rounded-md bg-muted" title="Perfil"></div>
    </div>
  </aside>

  <!-- Conteúdo -->
  <main class="row-start-2 col-start-2 p-6 space-y-8 overflow-auto">
    {#if currentView === 'detail'}
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h2 class="text-xl font-semibold">{selectedItem?.title}</h2>
            <p class="text-xs text-muted-foreground capitalize">{selectedType}</p>
          </div>
-          <Button variant="outline" size="sm" class="" disabled={false} on:click={goBack}>Voltar</Button>
+          <button type="button" class="h-8 px-3 rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground text-sm" on:click={goBack} aria-label="Voltar para a página inicial">Voltar</button>
        </div>
    
        <div class="grid gap-6 lg:grid-cols-5">
          <!-- Coluna esquerda (80%) -->
          <div class="lg:col-span-4">
            <div class="relative rounded-lg border bg-muted/40 overflow-hidden">
              {#if selectedItem?.previewUrl}
                <iframe src={selectedItem.previewUrl} title="Preview"
                  class="w-full h-[60vh] pointer-events-none"></iframe>
                {:else if selectedItem?.img}
                  <img src={selectedItem.img} alt={selectedItem.title}
                    class="w-full h-[60vh] object-cover select-none pointer-events-none" />
                {/if}
              </div>
            </div>
    
          <!-- Coluna direita (20%) -->
          <aside class="lg:col-span-1">
            <div class="border rounded-lg p-4 bg-card space-y-4">
              <div class="flex gap-2">
                {#if selectedType === 'mockups' || selectedType === 'plugins'}
                  <Button class="flex-1" disabled={false} on:click={() => onDownload(selectedItem)}>Download</Button>
                {:else}
                  <Button class="flex-1" disabled={false} on:click={() => onCopy(selectedItem.copyText || selectedItem.title)}>Copiar</Button>
                {/if}
                 <button class="size-9 grid place-items-center rounded-md border hover:bg-accent transition-colors" aria-label="Favoritar" title="Favoritar" on:click={() => toggleFavorite(selectedItem.id)}>
                   {#if isFav(selectedItem.id)}
                     <Star class="size-4 text-yellow-500" fill="currentColor" />
                   {:else}
                     <Star class="size-4" />
                   {/if}
                 </button>
              </div>
              <div>
                <h3 class="font-semibold">{selectedItem.title}</h3>
                <p class="text-sm text-muted-foreground mt-1">{selectedItem.description}</p>
              </div>
              {#if selectedItem.tags?.length}
                <div class="flex flex-wrap gap-2">
                  {#each selectedItem.tags as tag}
                    <span class="text-xs px-2 py-1 rounded-md border bg-muted/40">{tag}</span>
                  {/each}
                </div>
              {/if}
            </div>
          </aside>
    
          <!-- Área inferior (100%) -->
          <section class="lg:col-span-5 space-y-3">
            <div class="border rounded-lg p-4 bg-card">
              <form on:submit|preventDefault={() => { const t = commentInput?.value?.trim(); if (t) { addComment(t); commentInput.value = '' } }}>
                <div class="flex items-start gap-2">
                  <textarea bind:this={commentInput} class="flex-1 resize-none h-20 border rounded-md p-2 bg-background" placeholder="Escreva um comentário..."></textarea>
                  <Button type="submit" class="" disabled={false}>Comentar</Button>
                </div>
              </form>
            </div>
            <div class="space-y-2">
              {#if getComments().length === 0}
                <p class="text-sm text-muted-foreground">Sem comentários ainda.</p>
              {:else}
                {#each getComments() as c, idx}
                  <div class="border rounded-lg p-3 bg-card/50">
                    <p class="text-sm">{c.text}</p>
                    <p class="text-[10px] text-muted-foreground mt-1">{new Date(c.date).toLocaleString()}</p>
                  </div>
                {/each}
              {/if}
            </div>
          </section>
        </div>
      </section>
    {:else}
      <!-- Boas-vindas -->
      <section class="space-y-1">
        <h1 class="text-2xl font-bold">Bem-vindo, {user.name} 👋</h1>
        <p class="text-muted-foreground">Explore os recursos do Codpack para agilizar seus projetos no Elementor Pro.</p>
      </section>
    
      <!-- Listas horizontais -->
      {#each sections as sec}
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">{sec.label}</h2>
            <Button class="" disabled={false} size="sm" variant="ghost">Ver todos</Button>
          </div>
          <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide" style="scroll-behavior: smooth;">
            {#each sec.items.slice(0, 8) as item}
              <article class="snap-start group relative w-[calc(33.333%-0.75rem)] min-w-[280px] aspect-[16/10] rounded-lg overflow-hidden bg-muted select-none cursor-pointer" on:click={() => openDetail(item, sec.key)}>
                <!-- Overlay no hover -->
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <!-- Ações -->
                <div class="absolute top-2 right-2 flex gap-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                  <button class="size-9 grid place-items-center rounded-md border bg-background/80 hover:bg-accent hover:text-accent-foreground transition-colors" aria-label={sec.key === 'mockups' || sec.key === 'plugins' ? 'Download' : 'Copiar'} title={sec.key === 'mockups' || sec.key === 'plugins' ? 'Download' : 'Copiar'} on:click|stopPropagation={() => (sec.key === 'mockups' || sec.key === 'plugins') ? onDownload(item) : onCopy(item.title)}>
                    {#if sec.key === 'mockups' || sec.key === 'plugins'}
                      <Download class="size-4" />
                    {:else}
                      <Copy class="size-4" />
                    {/if}
                  </button>
                  <button class="size-9 grid place-items-center rounded-md border bg-background/80 hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Visualizar" title="Visualizar" on:click|stopPropagation={() => openDetail(item, sec.key)}>
                    <Eye class="size-4" />
                  </button>
                  <button class="size-9 grid place-items-center rounded-md border bg-background/80 hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Favoritar" title="Favoritar" on:click|stopPropagation={() => toggleFavorite(item.id)}>
                    {#if isFav(item.id)}
                      <Star class="size-4 text-yellow-500" fill="currentColor" />
                    {:else}
                      <Star class="size-4" />
                    {/if}
                  </button>
                </div>
                <!-- Rodapé do card (título) -->
                <div class="absolute inset-x-0 bottom-0 p-3 text-xs text-white/90 drop-shadow-sm">
                  {item.title}
                </div>
              </article>
            {/each}
          </div>
        </section>
      {/each}
    {/if}
  </main>
</div>
