import API from '../utils/API';
import { ADD_PRINT, LOADING } from '../utils/actions';

export default function AddPrint(props, dispatch) {

  dispatch({ type: LOADING })
  API.createPrint({
    name: props.name,
    description: props.description,
    series: props.series,
    price: parseFloat(props.price).toFixed(2),
    image: props.image,
  })
    .then(({ data }) => {
      dispatch({
        type: ADD_PRINT,
        print: data
      });
    })
    .catch(err => console.log(err));
}
