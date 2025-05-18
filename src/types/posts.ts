export interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
}

export interface Post {
  id?: string;
  title: string;
  content: string;
}

export interface PostFormProps {
  post?: Post;
  onSuccessRedirect?: string;
  categories: Category[];
}
