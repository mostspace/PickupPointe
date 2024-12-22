import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid, Container } from '@mui/material';
import ShopItem from 'src/components/shop-item';

export default function OurTreasures() {
  const navigate = useNavigate();

  const shopList = useSelector((state) => state.market.shopList.shops?.slice(0, 8));

  return (
    <Container
      maxWidth="xl"
      sx={{
        padding: {
          xs: "40px 0",
          md: "120px 0 0 0",
        },
      }}
    >
      <div className="flex justify-center items-center">
        <h3 className="text-[24px] sm:text-[40px] font-semibold ss:leading-[52px] text-center text-heading pb-[40px] font-gilroyBold">
          Discover Local Spots At Local Prices
        </h3>
      </div>

      <Grid container spacing={2}>
        {shopList?.map((shop, index) => (
          <Grid item xl={3} lg={3} md={4} sm={6} xs={12} key={index}
            sx={{
              width: "100%",
              animation: `fadeIn 0.8s ease-in-out forwards ${index * 0.2}s`,
              opacity: 0,
            }}
            onClick={() => navigate(`/find-local-vendors/vendor-profile/${shop._id}`)}
          >
            <ShopItem 
              shopImage={shop.photo}
              shopLogo={shop.logo}
              shopName={shop.name}
              remainingTime={shop.remainTime}
              savingRate={shop.savePercent}
              categories={shop.categories}
              rating={shop.averageRate}
              delivery={shop.delivery}
              distance={shop.distance}
            />
          </Grid>
        ))} 
      </Grid>
    </Container>
  );
}