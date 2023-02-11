import { ClipLoader } from 'react-spinners';
import TxCell from './TxCell';

export default function HistoryFlip(props) {
  console.log(props.data);
  return (
    <div className="miscstats_section">
      <div
        className="table_box"
        style={{ height: '500px', overflowY: 'auto', borderRadius: '5px' }}
      >
        {!props.loading &&
          props.data &&
          props.data.map((item, index) => <TxCell key={index} index={index} data={item} />)}
        {props.loading && (
          <div className="loading">
            <ClipLoader color="#36d7b7" />
          </div>
        )}
      </div>
    </div>
  );
}
