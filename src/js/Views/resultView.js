import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    "The recipe you searched for doesn't exist, please try another one";
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultView();
