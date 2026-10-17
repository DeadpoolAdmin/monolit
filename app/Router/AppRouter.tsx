import { Activation } from "@/modules/Activation";
import Languages from "@/modules/Languages";
import Welcome from "@/modules/Welcome";
import Header from "@/layout/Header";
import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import Menu from "@/modules/Menu";
import InfoCenter from "@/modules/InfoCenter";
import Information from "@/modules/InfoCenter/pages";
import SubCategories from "@/modules/InfoCenter/pages/SubCategories";
import Detail from "@/modules/InfoCenter/pages/Detail/Detail";
import LiveTV from "@/modules/LiveTV";
import { AppContent } from "../AppContent";
import Movies from "@/modules/Movies/pages";
import MovieContainer from "@/modules/Movies/layout/Layout";
import MovieDetail from "@/modules/Movies/pages/MovieDetail";
import MovieVideoPlayer from "@/modules/Movies/pages/MovieVideoPlayer";
import ProductsContainer from "@/modules/Products/Layout/Layout";
import Products from "@/modules/Products/pages";
import ProductCategories from "@/modules/Products/pages/categories/ProductCategories";
import ProductCategory from "@/modules/Products/pages/categories/ProductCategory";
import ProductDetail from "@/modules/Products/pages/detail/ProductDetail";
import Cast from "@/modules/Cast";
import Settings from "@/modules/Settings";
import Applications from "@/modules/Applications";
import AirportContainer from "@/modules/Airport/layout/AirportContainer";
import Airport from "@/modules/Airport/pages";
import Flights from "@/modules/Airport/pages/Flights";
import MusicContainer from "@/modules/Music/layout/Layout";
import MusicCategories from "@/modules/Music/pages";
import Musics from "@/modules/Music/pages/Musics";
import OrdersContainer from "@/modules/MyOrders/layout/OrdersContainer";
import Orders from "@/modules/MyOrders/pages";
import Order from "@/modules/MyOrders/pages/Order";
import AlarmContainer from "@/modules/Alarm/layout/AlarmContainer";
import Alarm from "@/modules/Alarm/pages";
import SelectTime from "@/modules/Alarm/pages/SelectTime";
import ChatContainer from "@/modules/Chat/layout/Layout";
import Chat from "@/modules/Chat/pages";
import { AuthGuard } from "@shared/components/AuthGuard/AuthGuard";
import NoScreen from "@/modules/Signage/pages/NoScreen";
import SignageImage from "@/modules/Signage/pages/SigangeImage";
import SignageUrl from "@/modules/Signage/pages/SigangeUrl";
import SignageVideo from "@/modules/Signage/pages/SigangeVideo";
import Signage from "@/modules/Signage";
import NotificationContainer from "@/modules/Notifications/layout/NotificationContainer";
import Notifications from "@/modules/Notifications/pages";
import ActivationMobileContainer from "@/modules/ActivationMobile/layout/ActivationMobileContainer";
import ActivationMobile from "@/modules/ActivationMobile";
import RoomControlContainer from "@/modules/RoomControl/layout/layout";
import RoomControl from "@/modules/RoomControl";

export const AppRouter = () => {
  return (
    <HashRouter>
      <AppContent>
        <AuthGuard>
          <Routes>
            {
              // Routes for digital signgage
              <Route path="/signage" element={<Signage />}>
                <Route path="no-screen" element={<NoScreen />} />
                <Route path="signage-image" element={<SignageImage />} />
                <Route path="signage-video" element={<SignageVideo />} />
                <Route path="signage-url" element={<SignageUrl />} />
              </Route>
            }

            {/* Routes without Header layout */}
            <Route path="/" element={<Activation />} />
            <Route path="/activate" element={<Activation />} />
            <Route path="/languages" element={<Languages />} />
            <Route path="/menu/livetv" element={<LiveTV />} />
            <Route path="/menu/messages" element={<ChatContainer />}>
              <Route index element={<Chat />} />
            </Route>

            {/* Routes with Header layout */}
            <Route path="/welcome" element={<Header />}>
              <Route index element={<Welcome />} />
            </Route>

            <Route path="/menu" element={<Header />}>
              <Route index element={<Menu />} />
              <Route path="infocenter" element={<InfoCenter />}>
                <Route index element={<Information />} />
                <Route path="category/:id" element={<SubCategories />} />
                <Route path="category/:id/detail" element={<Detail />} />
              </Route>
              <Route path="vod" element={<MovieContainer />}>
                <Route index element={<Movies />} />
                <Route path=":id" element={<MovieDetail />} />
                <Route path=":id/player" element={<MovieVideoPlayer />} />
              </Route>

              <Route path="products" element={<ProductsContainer />}>
                <Route index element={<Products />} />
                <Route path="categories" element={<ProductCategories />} />
                <Route path="categories/:id" element={<ProductCategory />} />
                <Route path="categories/:id/detail" element={<ProductDetail />} />
              </Route>

              <Route path="services" element={<ProductsContainer />}>
                <Route index element={<Products />} />
                <Route path="categories" element={<ProductCategories />} />
                <Route path="categories/:id" element={<ProductCategory />} />
                <Route path="categories/:id/detail" element={<ProductDetail />} />
              </Route>

              <Route path="cast" element={<Cast />} />
              <Route path="settings" element={<Settings />} />
              <Route path="applications" element={<Applications />} />
              <Route path="airports" element={<AirportContainer />}>
                <Route index element={<Airport />} />
                <Route path="flights" element={<Flights />} />
              </Route>
              <Route path="music" element={<MusicContainer />}>
                <Route index element={<MusicCategories />} />
                <Route path=":id" element={<Musics />} />
              </Route>
              <Route path="radio" element={<MusicContainer />}>
                <Route index element={<MusicCategories />} />
                <Route path=":id" element={<Musics />} />
              </Route>
              <Route path="myorders" element={<OrdersContainer />}>
                <Route index element={<Orders />} />
                <Route path=":id" element={<Order />} />
              </Route>

              <Route path="alarm" element={<AlarmContainer />}>
                <Route index element={<Alarm />} />
                <Route path="selectTime" element={<SelectTime />} />
              </Route>

              <Route path="notifications" element={<NotificationContainer />}>
                <Route index element={<Notifications />} />
              </Route>

              <Route path="mobileapp" element={<ActivationMobileContainer />}>
                <Route index element={<ActivationMobile />} />
              </Route>

              <Route path="roomcontrol" element={<RoomControlContainer />}>
                <Route index element={<RoomControl />} />
              </Route>
            </Route>
          </Routes>
        </AuthGuard>
      </AppContent>     
    </HashRouter>
  );
};
