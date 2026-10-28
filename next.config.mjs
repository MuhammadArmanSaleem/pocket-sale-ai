import createNextIntlPlugin from 'next-intl/plugin';
const config = {};
export default createNextIntlPlugin('./i18n/request.ts')(config);
