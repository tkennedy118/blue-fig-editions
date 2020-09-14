import API from '../utils/API';
import { REMOVE_PRINT, ADD_PRINT, LOADING } from '../utils/actions';

export default function UpdatePrint(print, dispatch) {
  dispatch({ type: LOADING });
  API.updatePrint(print._id, {
    name: print.name,
    description: print.description,
    series: print.series,
    price: parseFloat(print.price).toFixed(2),
    image: print.image,
    featured: print.featured,
    about: print.about
  }, {
    new: true,
    overwrite: true
  })
    .then(({ data }) => {
      dispatch({
        type: REMOVE_PRINT,
        _id: data._id
      });
      dispatch({
        type: ADD_PRINT,
        print: data
      });
    })
    .catch(err => console.log(err));
}
