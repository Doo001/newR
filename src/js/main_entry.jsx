// 学科主功能
import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, browserHistory, IndexRedirect} from 'react-router';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import {Provider} from 'react-redux'
import ItemView from './item/view';
import ItemParsingPage from '../subjects/<%SUBJECT%>/parsePage';
import ItemTypesetting from './item/typesetting';
import ItemTagging from './item/tagging';
import Lesson from './lesson/index'
import ItemList from './item/list';
import ClusterView from './item/cluster';
import TaggingView from './ktag/index';
import KtagItemCount from './item/ktag_item_count';
import {VolumeInputPage} from './item/input';
import {VolumeListPage} from './item/volume_list';
import {VolumePage} from './item/volume_view';

import {DocInputPage} from './item/doc_input';
import {DocPage} from './item/doc_view';
import {DocListPage} from './item/doc_list';

import ItemSearch from './item/search';

import {OmegaPaperList} from './paper/omega_list';
import {OmegaPaper} from './paper/omega_view';
import {OmegaPaperCreate} from './paper/omega_create';
import {TextBookPage} from './paper/textbooks';
import Quality from './quality/qualityManage';

import Preview from './plan/preview'
import Composition from './paper/composition'
import PaperPreview from './paper/preview'
import PaperVerify from './paper/verify'
import reducers from '../store/reducers'
//library.add(faStroopwafel)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let middleWare;
if (process.env.NODE_ENV != "production") {
  middleWare = applyMiddleware(logger, thunk)
} else {
  middleWare = applyMiddleware(thunk)
}
export const store = createStore(reducers, composeEnhancers(middleWare))
window.store = store;
ReactDom.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/item/parse' component={ItemParsingPage}/>
      <Route path='/item/:id' component={ItemView}/>
      <Route path='/item/:id/tag' component={ItemTagging}/>
      <Route path='/item/:id/typeset' component={ItemTypesetting}/>
      <Route path='/item/:id/cluster' component={ClusterView}/>
      <Route path='/items/list' component={ItemList}/>
      <Route path='/volume/input' component={VolumeInputPage}/>
      <Route path='/volumes' component={VolumeListPage}/>
      <Route path='/volume/:id' component={VolumePage}/>

      <Route path='/doc/input' component={DocInputPage}/>
      <Route path='/doc/:id' component={DocPage}/>
      <Route path='/docs' component={DocListPage}/>

      <Route path='/item_search' component={ItemSearch}/>
      <Route path='/ktags/item_count' component={KtagItemCount}/>
      <Route path='/ktags/' component={TaggingView}>
        <IndexRedirect to="/ktags/<%PLANID%>"/>
      </Route>
      <Route path='/lesson/:edu' component={Lesson}>

      </Route>
      <Route path='/ktags/:type' component={TaggingView}/>

      <Route path='/textbooks' component={TextBookPage}/>

      <Route path='/omega_papers' component={OmegaPaperList}/>
      <Route path='/omega_paper/:id' component={OmegaPaper}/>
      <Route path='/paper/create' component={OmegaPaperCreate}/>
      <Route path='/plan/preview/:id' component={Preview}></Route>
      <Route path='/paper/composition/:id' component={Composition}></Route>
      <Route path='/paper/preview/:id' component={PaperPreview}></Route>
      <Route path='/paper/verify/:id' component={PaperVerify}></Route>
      <Route path='/quality' component={Quality}/>
    </Router>
  </Provider>

), document.getElementById('main'));
