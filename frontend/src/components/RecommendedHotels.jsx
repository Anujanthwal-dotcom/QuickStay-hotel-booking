import HotelCard from './HotelCard'
import Title from './Title'
import { useAppContext } from '../context/AppContext'
import { useEffect, useState } from 'react';

const RecommendedHotels = () => {
  let {rooms,searchedCities} = useAppContext();
  const [recommended,setRecommended] = useState([]);

  const filterHotels = ()=>{
    if(searchedCities===undefined) searchedCities=[];
    const filteredHotels = rooms.slice().filter(room=>searchedCities.includes(room.hotel.city));
    setRecommended(filteredHotels);
  }

  useEffect(()=>{
    filterHotels();
  },[rooms,searchedCities]);

  return recommended.length>0 && (

    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20 '>
        <Title title={`Recommended Destination`} subTitle={`Discover our handpicked selected of exceptional properties around the world.`} />
        <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
            {
                recommended.slice(0,4).map((room,index)=>(<HotelCard key={room._id} room={room} index={index}/>))
            }
        </div>
    </div>
  )
}

export default RecommendedHotels