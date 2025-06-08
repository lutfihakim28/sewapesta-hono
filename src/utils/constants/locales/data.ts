export const dataEn = {
  category: 'category | categories',
  city: 'city | cities',
  district: 'district | districts',
  equipment: 'equipment | equipments',
  image: 'image | images',
  inventory: 'inventory | inventories',
  item: 'item | items',
  option: 'option | options',
  owner: 'owner | owners',
  package: 'package | packages',
  product: 'product | products',
  province: 'province | provinces',
  revenueTerm: 'revenue term | revenue terms',
  subdistrict: 'subdistrict | subdistricts',
  unit: 'unit | units',
  user: 'user | users',
  dataName: (params: { data: string }) => `${params.data}'s name`,
  withCode: (params: { data: string, value: string | number }) => `${params.data} with code ${params.value}`,
  withId: (params: { data: string, value: string | number }) => `${params.data} with ID ${params.value}`,
  withName: (params: { data: string, value: string | number }) => `${params.data} with name ${params.value}`,
  withUsername: (params: { data: string, value: string | number }) => `${params.data} with username ${params.value}`,
  get categoryOptions() {
    const [category, _] = this.category.replaceAll(' ', '').split('|')
    const [__, options] = this.option.replaceAll(' ', '').split('|')
    return `${category} ${options}`
  },
  get packageOptions() {
    const [_package, _] = this.package.replaceAll(' ', '').split('|')
    const [__, options] = this.option.replaceAll(' ', '').split('|')
    return `${_package} ${options}`
  },
  get productOptions() {
    const [_product, _] = this.product.replaceAll(' ', '').split('|')
    const [__, options] = this.option.replaceAll(' ', '').split('|')
    return `${_product} ${options}`
  },
  get inventoryDamageReport() {
    const [inventory, _] = this.inventory.replaceAll(' ', '').split('|')
    return `${inventory} damage report | ${inventory} damage reports`
  },
  get inventoryMutation() {
    const [inventory, _] = this.inventory.replaceAll(' ', '').split('|')
    return `${inventory} mutation | ${inventory} mutations`
  },
  get inventoryUsage() {
    const [inventory, _] = this.inventory.replaceAll(' ', '').split('|')
    return `${inventory} usage | ${inventory} usages`
  },
  get itemRevenueTerm() {
    const [item, _] = this.item.replaceAll(' ', '').split('|')
    const [singular, plural] = this.revenueTerm.replaceAll(' ', '').split('|')
    return `${item} ${singular} | ${item} ${plural}`
  },
  get ownerRevenueTerm() {
    const [owner, _] = this.owner.replaceAll(' ', '').split('|')
    const [singular, plural] = this.revenueTerm.replaceAll(' ', '').split('|')
    return `${owner} ${singular} | ${owner} ${plural}`
  },
  get packageItem() {
    const [item, items] = this.item.replaceAll(' ', '').split('|')
    const [_package, _] = this.package.replaceAll(' ', '').split('|')
    return `${_package} ${item} | ${_package} ${items}`
  }
}

export const dataId: typeof dataEn = {
  category: 'kategori',
  city: 'kota',
  district: 'kecamatan',
  equipment: 'peralatan',
  image: 'gambar',
  inventory: 'perlengkapan',
  item: 'barang',
  option: 'pilihan',
  owner: 'pemilik',
  package: 'paket',
  product: 'produk',
  province: 'provinsi',
  revenueTerm: 'ketentuan pendapatan',
  subdistrict: 'kelurahan',
  unit: 'satuan',
  user: 'pengguna',
  dataName: (params: { data: string }) => `nama ${params.data}`,
  withCode: (params: { data: string, value: string | number }) => `${params.data} dengan kode ${params.value}`,
  withId: (params: { data: string, value: string | number }) => `${params.data} dengan ID ${params.value}`,
  withName: (params: { data: string, value: string | number }) => `${params.data} dengan nama ${params.value}`,
  withUsername: (params: { data: string, value: string | number }) => `${params.data} dengan nama pengguna ${params.value}`,
  get categoryOptions() {
    return `${this.option} ${this.category}`
  },
  get packageOptions() {
    return `${this.option} ${this.package}`
  },
  get productOptions() {
    return `${this.option} ${this.product}`
  },
  get inventoryDamageReport() {
    return `laporan ${this.inventory} rusak`
  },
  get inventoryMutation() {
    return `mutasi ${this.inventory}`
  },
  get inventoryUsage() {
    return `penggunaan ${this.inventory}`
  },
  get itemRevenueTerm() {
    return `${this.revenueTerm} ${this.item}`
  },
  get ownerRevenueTerm() {
    return `${this.revenueTerm} ${this.owner}`
  },
  get packageItem() {
    return `${this.item} ${this.package}`
  }
}