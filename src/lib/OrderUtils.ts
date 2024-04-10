export const FormatDate = (date: Date) => {
  // Create an array of month names for conversion
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract day, month, and year from the Date object
  const day = date.getDate();
  const month = date.getMonth(); // 0-based index
  // const year = date.getFullYear();

  // Convert the month number to the month name
  const formattedMonth = monthNames[month];

  // Create the formatted string
  const formattedDate = `${day} ${formattedMonth}`;

  return formattedDate;
};
export const bgColor = (status: any, lighten: any) => {
  switch (status) {
    case "ORDER SENT": {
      return lighten("#FFEF98", 0.5);
    }
    case "ORDER RECEIVED": {
      return lighten("#FFEF98", 0.5);
    }
    case "EDIT ENABLED": {
      return lighten("#c3c3c3", 0.5);
    }
    case "INVOICED": {
      return lighten("#CAE6FE", 0.5);
    }
    default: {
      return null;
    }
  }
};
export const statusColor = (status: any) => {
  switch (status) {
    case "ORDER SENT": {
      return "#C0941A";
    }
    case "ORDER RECEIVED": {
      return "#C0941A";
    }
    case "ORDER ACKNOWLEDGED": {
      return "#F57C00";
    }
    case "INVOICED PARTIALLY": {
      return "#316686";
    }
    case "PARTIALLY SHIPPED": {
      return "#F57C00";
    }
    case "REQUESTED EDIT": {
      return "#F57C00";
    }
    case "EDIT IN PROGRESS": {
      return "#36833C";
    }
    case "EDIT ENABLED": {
      return "#4caf50";
    }
    case "EDIT DISABLED": {
      return "#D32F2F";
    }
    case "ORDER ACCEPTED": {
      return "#5FA100";
    }
    case "ORDER BOOKED": {
      return "#388E3C";
    }
    case "INVOICED": {
      return "#316686";
    }
    case "SHIPPED": {
      return "#7554A5";
    }
    case "ORDER CANCELLED": {
      return "#D32F2F";
    }
    default: {
      return "#c3c3c3";
    }
  }
};

export const actionStatus = (action: string, updatedBuyerStatus: any) => {
  switch (action) {
    case "CREATE_ORDER_BY_SELLER": {
      if (updatedBuyerStatus === "ORDER ACKNOWLEDGED") {
        return "ORDER ACKNOWLEDGED";
      } else {
        return "ORDER SENT";
      }
    }
    case "CREATE_ORDER_BY_BUYER ": {
      if (updatedBuyerStatus === "ORDER ACKNOWLEDGED") {
        return "ORDER ACKNOWLEDGED";
      } else {
        return "ORDER SENT";
      }
    }
    case "CREATE_ORDER_BY_BUYER": {
      if (updatedBuyerStatus === "ORDER ACKNOWLEDGED") {
        return "ORDER ACKNOWLEDGED";
      } else {
        return "ORDER SENT";
      }
    }
    case "ACCEPT_ORDER": {
      return "ORDER ACCEPTED";
    }
    case "ORDER_BOOKED": {
      return "ORDER BOOKED";
    }
    case "REQUEST_EDIT": {
      return "EDIT IN PROGRESS";
    }
    case "ENABLE_EDIT": {
      return "EDIT IN PROGRESS";
    }
    case "DISABLE_EDIT": {
      if (updatedBuyerStatus === "ORDER ACKNOWLEDGED") {
        return "ORDER ACKNOWLEDGED";
      } else {
        return "ORDER SENT";
      }
    }
    case "CREATE_NEW_VERSION": {
      return "ORDER ACKNOWLEDGED";
    }
    case "INVOICED": {
      return "INVOICED";
    }
    case "SHIPPED": {
      return "SHIPPED";
    }
    case "INVOICED_PARTIALLY": {
      return "INVOICED";
    }
    case "PARTIALLY_SHIPPED": {
      return "SHIPPED";
    }
    case "CANCELLED_INVOICE": {
      return "INVOICE CANCELLED";
    }
    case "CANCEL_ORDER": {
      return "ORDER CANCELLED";
    }
    default: {
      return null;
    }
  }
};
