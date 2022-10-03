import { listTemplate } from '.';

export const useListFormatter = ({
  customFormatters = {},
  ...listTemplateProps
}) => {
  return {
    ...listTemplate(listTemplateProps),
    ...customFormatters,
  };
};
