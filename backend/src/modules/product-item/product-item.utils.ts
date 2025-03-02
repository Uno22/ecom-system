import { ProductItemAttributeDto } from './dto';
import { ProductItem } from './model/product-item.model';
import { get } from 'lodash';

export function formatAttributes(item: ProductItem) {
  const variants = item.variantItems;
  item['attributes'] = [];
  if (variants && variants.length) {
    item['attributes'] = variants
      .map((item: any) => {
        const value = item.variantItem?.value;
        const name = item.variantItem?.variant?.name;
        if (name && value) {
          return { name, value };
        }
        return null;
      })
      .filter((item: any) => item !== null);
    delete item['variantItems'];
  }
}

export function isAttributesDuplicateValue(
  attributes: ProductItemAttributeDto[],
) {
  const objAttr: { [key: string]: string[] } = {};
  for (const attribute of attributes) {
    const { variantId, variantItemId } = attribute;
    if (!objAttr[variantId]) {
      objAttr[variantId] = [];
    }
    if (objAttr[variantId].length > 0) {
      return true;
    }
    objAttr[variantId].push(variantItemId);
  }
}

export function isProductItemDuplicateWithAttributes(
  newAttributes: ProductItemAttributeDto[],
  currentProductItems: ProductItem[],
) {
  for (const productItem of currentProductItems) {
    const variantItems = productItem.variantItems || [];
    if (
      variantItems.length === 0 ||
      variantItems.length !== newAttributes.length
    ) {
      continue;
    }

    let isDuplicateWithAllAttributes = true;
    for (const variantItem of variantItems) {
      const variantId = get(variantItem, 'variantItem.variantId');
      const variantItemId = get(variantItem, 'variantItemId');
      const foundAttribute = newAttributes.find(
        (attr) =>
          attr.variantId === variantId && attr.variantItemId === variantItemId,
      );

      if (!foundAttribute) {
        isDuplicateWithAllAttributes = false;
        break;
      }
    }

    if (isDuplicateWithAllAttributes) {
      return true;
    }
  }

  return false;
}
