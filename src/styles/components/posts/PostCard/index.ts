// PostCard Styles - Main exports
export * from './Card.styles';
export * from './Content.styles';
export * from './Meta.styles';

// Re-export with organized naming for easy usage
export { Card as PostCard } from './Card.styles';
export {
  Header as PostHeader,
  Content as PostContent,
  Title as PostTitle,
} from './Content.styles';
export {
  Meta as PostMeta,
  StatusBadge as PostStatusBadge,
  Categories as PostCategories,
  CategoryTag as PostCategoryTag,
} from './Meta.styles';
