// Export all order-related components
export { default as OrderFileUpload } from './OrderFileUpload';
export type { FileWithPreview } from './OrderFileUpload';

export { default as OrderContactForm } from './OrderContactForm';
export type { ContactInfo } from './OrderContactForm';

export { default as OrderFormBase } from './OrderFormBase';
export { default as PrintSpecifications } from './PrintSpecifications';

// Email service and types
export { 
  sendOrderEmail, 
  generateOrderId, 
  formatOrderSpecifications 
} from './OrderEmailService';

export type { 
  OrderSpecifications, 
  OrderDetails, 
  EmailResponse 
} from './OrderEmailService'; 