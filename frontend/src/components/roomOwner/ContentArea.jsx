import Dashboard from "./Dashboard";
import BookingsList from "./BookingListRO";
import AddNewHome from "./AddHome";
import AllHomes from "./AllHomes";
import ActiveBookings from "./ActiveBookings";
import Revenue from "./Revenue";
import Reviews from "./Reviews";
import Settings from "./Settings";

const ContentArea = ({ activeSection, setActiveSection }) => {
  switch (activeSection) {
    case "dashboard":
      return <Dashboard />;
    case "add-home":
      return <AddNewHome />;
    case "all-homes":
      return <AllHomes setActiveSection={setActiveSection} />;
    case "active-bookings":
      return <ActiveBookings />;
    case "all-bookings":
      return <BookingsList />;
    case "revenue":
      return <Revenue />;
    case "reviews":
      return <Reviews />;
    // case "notifications":
    //   return <Notifications />;
    // case "help":
    //   return <HelpSupport />;
    case "settings":
      return <Settings />;
    default:
      return <Dashboard />;
  }
};

export default ContentArea;
