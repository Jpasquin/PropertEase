export default function useDataHandling () {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(value);
  }
  
  const propertyTitle = (propertyType: string, propertyProvince: string, propertyCity: string) => {
    let propertyTitle;
    switch (propertyType) {
      case 'condo':
        propertyTitle = 'Condo in ';
        break;
      case 'house':
        propertyTitle = 'Home in ';
        break;
      default:
        propertyTitle = 'Home in ';
        break;
    }
    return propertyTitle + propertyCity?.charAt(0).toUpperCase() + propertyCity?.slice(1) + ', ' + propertyProvince?.toUpperCase();
  }

  return {
    formatCurrency,
    propertyTitle
  }
}