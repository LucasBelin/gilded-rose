import InMemoryItemsRepository from "../app/data-access/InMemoryItemsRepository"
import AgingItem from "../app/item/AgingItem"
import ConjuredItem from "../app/item/ConjuredItem"
import GenericItem from "../app/item/GenericItem"
import { ItemType } from "../app/item/Item"
import LegendaryItem from "../app/item/LegendaryItem"
import SellItemRequest from "../app/shop/SellItemRequest"
import ShopInteractor from "../app/shop/ShopInteractor"

describe("Gilded Rose, GenericItem", () => {
  it("Should build", () => {
    expect(true).toBe(true)
  })

  it("Should have a name", () => {
    const item = new GenericItem("foo", 0, 0, 0)
    expect(item.name).toBe("foo")
  })

  it("Should have a sellIn", () => {
    const item = new GenericItem("foo", 0, 0, 0)
    expect(item.sellIn).toBe(0)
  })

  it("Should have a quality", () => {
    const item = new GenericItem("foo", 0, 0, 0)
    expect(item.quality).toBe(0)
  })

  it("Should update sellIn", () => {
    const item = new GenericItem("foo", 2, 0, 0)
    item.update()
    expect(item.sellIn).toBe(1)
  })

  it("Should update quality", () => {
    const item = new GenericItem("foo", 1, 2, 0)
    item.update()
    expect(item.quality).toBe(1)
  })

  it("Should update quality with sellIn below zero", () => {
    const item = new GenericItem("foo", 0, 2, 0)
    item.update()
    expect(item.quality).toBe(0)
  })

  it("Should not update quality below 0", () => {
    const item = new GenericItem("foo", 0, 0, 0)
    item.update()
    expect(item.quality).toBe(0)
  })

  it("Should update quality twice as fast after sellIn", () => {
    const item = new GenericItem("foo", 0, 4, 0)
    item.update()
    expect(item.quality).toBe(2)
  })

  it("Should not update quality below 0 after sellIn", () => {
    const item = new GenericItem("foo", 0, 1, 0)
    item.update()
    expect(item.quality).toBe(0)
  })

  it("Should not update quality above 50", () => {
    const item = new GenericItem("foo", 1, 51, 0)
    item.update()
    expect(item.quality).toBe(50)
  })
})

describe("Gilded Rose, LegendaryItem", () => {
  it("Should not update LegendaryItem", () => {
    const item = new LegendaryItem("Sulfuras", 1, 80, 0)
    item.update()
    expect(item.quality).toBe(80)
  })
})

describe("Gilded Rose, ConjuredItem", () => {
  it("Should update ConjuredItem", () => {
    const item = new ConjuredItem("Conjured", 1, 50, 0)
    item.update()
    expect(item.quality).toBe(48)
  })

  it("Should update ConjuredItem twice as fast after sellIn", () => {
    const item = new ConjuredItem("Conjured", 0, 50, 0)
    item.update()
    expect(item.quality).toBe(46)
  })

  it("Should not update ConjuredItem below 0", () => {
    const item = new ConjuredItem("Conjured", 0, 1, 0)
    item.update()
    expect(item.quality).toBe(0)
  })
})

describe("Gilded Rose, AgingItem", () => {
  it("Should update AgingItem", () => {
    const item = new AgingItem("Aged Brie", 1, 49, 0)
    item.update()
    expect(item.quality).toBe(50)
  })

  it("Should update AgingItem twice as fast after sellIn", () => {
    const item = new AgingItem("Aged Brie", 0, 48, 0)
    item.update()
    expect(item.quality).toBe(50)
  })

  it("Should not update AgingItem above 50", () => {
    const item = new AgingItem("Aged Brie", 0, 50, 0)
    item.update()
    expect(item.quality).toBe(50)
  })
})

describe("Gilded Rose, ShopInteractor", () => {
  let inMemoryItemsRepository: InMemoryItemsRepository
  let shop: ShopInteractor

  beforeEach(() => {
    inMemoryItemsRepository = new InMemoryItemsRepository()
    shop = new ShopInteractor(inMemoryItemsRepository)
  })

  it("Should update inventory", () => {
    shop.updateInventory()
    const items = shop.getInventory()
    expect(items[0].quality).toBe(9)
    expect(items[1].quality).toBe(10)
    expect(items[2].quality).toBe(80)
    expect(items[3].quality).toBe(80)
    expect(items[4].quality).toBe(48)
    expect(items[5].quality).toBe(46)
    expect(items[6].quality).toBe(18)
    expect(items[7].quality).toBe(19)
    expect(items[8].quality).toBe(50)
    expect(items[9].quality).toBe(0)
  })

  it("Should find item by type", () => {
    const generic = shop.findItem(ItemType.Generic, 10)
    const Legendary = shop.findItem(ItemType.Legendary, 80)
    const conjured = shop.findItem(ItemType.Conjured, 50)
    const aging = shop.findItem(ItemType.Aging, 17)
    const event = shop.findItem(ItemType.Event, 49)

    const items = shop.getInventory()

    expect(generic).toBe(items[0])
    expect(Legendary).toBe(items[2])
    expect(conjured).toBe(items[4])
    expect(aging).toBe(items[6])
    expect(event).toBe(items[8])
  })

  it("Should sell item", () => {
    const length = shop.getInventory().length
    shop.sellItem(new SellItemRequest(ItemType.Generic, 10))

    expect(shop.getInventory().length).toBe(length - 1)
    expect(() => shop.findItem(ItemType.Generic, 10)).toThrowError()
    expect(shop.getBalance()).toBe(5)
  })
})
