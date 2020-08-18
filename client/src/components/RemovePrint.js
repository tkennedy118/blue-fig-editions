import API from '../utils/API';
import { REMOVE_PRINT, LOADING } from '../utils/actions';

export default function RemovePrint(id, dispatch) {

  dispatch({ type: LOADING });
  API.deletePrint(id)
    .then(({ data }) => {
      dispatch({
        type: REMOVE_PRINT,
        _id: data._id
      });
    })
    .catch(err => console.log(err));
}
