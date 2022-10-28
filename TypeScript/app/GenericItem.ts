import Item, { ItemType } from "./Item"

class GenericItem extends Item {
  public type: ItemType

  constructor(name: string, sellIn: number, quality: number, basePrice: number) {
    super(name, sellIn, quality, basePrice)
    this.type = ItemType.Generic
  }

  update(): void {
    this.sellIn -= 1
    this.quality -= 1
    if (this.sellIn < 0) {
      this.quality -= 1
    }
    if (this.quality < 0) {
      this.quality = 0
    }
  }
}

export default GenericItem
