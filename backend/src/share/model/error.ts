/****************** Common Error ******************/
export const ErrInvalidData = new Error('Invalid data');
export const ErrNameMustBeAtLeast2Characters = new Error(
  'Name must be at least 2 characters',
);
export const ErrValueMustBeAtLeast2Characters = new Error(
  'Value must be at least 2 characters',
);
export const ErrDataDuplicated = new Error('Data already exits');
export const ErrInvalidUUID = new Error('Id should be uuid');
export const ErrDataNotFound = new Error('Data not found');
export const ErrDataEmpty = new Error('Data is empty');

/****************** Category Error ******************/
export const ErrCategoryNotFound = new Error('Category not found');
export const ErrCategoryIdMustBeValidUUID = new Error(
  'Category ID must be a valid UUID',
);

/****************** Brand Error ******************/
export const ErrBrandNotFound = new Error('Brand not found');
export const ErrBrandIdMustBeValidUUID = new Error(
  'Brand ID must be a valid UUID',
);

/****************** Product Error ******************/
export const ErrProductNotFound = new Error('Product not found');
export const ErrProductIdMustBeValidUUID = new Error(
  'Product ID must be a valid UUID',
);
export const ErrPriceMustBePositive = new Error('Price must be positive');
export const ErrSalePriceMustBeNonnegative = new Error(
  'Sale price must be nonnegative',
);
export const ErrQuantityMustBeNonnegative = new Error(
  'Quantity must be nonnegative',
);
export const ErrFromPriceMustBePositive = new Error(
  'From price must be positive',
);
export const ErrToPriceMustBePositive = new Error('To price must be positive');
/****************** User Error ******************/
export const ErrFirstNameAtLeast2Chars = new Error(
  'First name must be at least 2 characters',
);
export const ErrLastNameAtLeast2Chars = new Error(
  'Last name must be at least 2 characters',
);
export const ErrEmailInvalid = new Error('Email is invalid');
export const ErrPasswordAtLeast6Chars = new Error(
  'Password must be at least 6 characters',
);
export const ErrBirthdayInvalid = new Error('Birthday is invalid');
export const ErrGenderInvalid = new Error('Gender is invalid');
export const ErrRoleInvalid = new Error('Role is invalid');
export const ErrEmailExisted = new Error('Email is already existed');
export const ErrInvalidEmailAndPassword = new Error(
  'Invalid email and password',
);
export const ErrUserInactivated = new Error('User is inactivated or banned');
export const ErrInvalidToken = new Error('Invalid token');
export const ErrUserNotFound = new Error('User not found');
export const ErrPasswordIncorrect = new Error('Password incorrect');
export const ErrUserHasNoPermission = new Error('User has no permission');
/****************** Cart Error ******************/
export const ErrQuantityMustBePositive = new Error('Quantity must be positive');
export const ErrProductNotEnoughQuantity = new Error(
  'Product not enough quantity',
);
export const ErrCartItemNotFound = new Error('Cart item not found');
export const ErrCartNotFound = new Error('Cart not found');
