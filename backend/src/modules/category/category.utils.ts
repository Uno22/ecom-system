import { Category } from './model/category.model';

export function buildCategoryTree(categories: Category[]): Category[] {
  const categoriesTree: Category[] = [];
  const mapChildren = new Map<string, Category[]>();

  for (let i = 0; i < categories.length; i++) {
    const category: any = categories[i];
    const { id, parentId } = category;

    if (!mapChildren.has(id)) {
      mapChildren.set(id, []);
    }

    category.children = mapChildren.get(id);

    if (
      !parentId ||
      !categories.find((item: Category) => item.id === parentId)
    ) {
      categoriesTree.push(category);
    } else {
      if (!mapChildren.has(parentId)) {
        mapChildren.set(parentId, []);
      }
      mapChildren.get(parentId)!.push(category);
    }
  }

  return categoriesTree;
}
