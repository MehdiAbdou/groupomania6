import { useSelector } from "react-redux";
import LeftNav from '../components/LeftNav';
import { isEmpty } from "../components/Utils";
import Card from "../components/Post/Card";
import Trends from "../components/Trends";


const Trending = () => {
  
  const trendList = useSelector((state) => state.trendingReducer);

  return <div className="trending-page">
    <LeftNav />
    <div className="main">
      <ul>
        {!isEmpty(trendList[0]) && trendList.map((post) => <Card post={post} key={post._id} />)}
      </ul>
    </div>
    <div className="right-side">
      <div className="right-side-container">
        <Trends />
        
      </div>
    </div>
  </div>;
};

export default Trending;