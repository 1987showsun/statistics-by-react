import React,{ Component }                            from 'react';
import { connect }                                    from 'react-redux';
import { Route, Link }                                from 'react-router-dom';
import $                                              from 'jquery';

//Actions
import { getAllMenu }                                 from '../../actions/getAllData';
import { update }                                     from '../../actions/admin/update';

@connect((state,props)=>{
  return{
    popupMsg     : state.popup.msg,
    menuData     : state.search.data,
    seleEditData : state.popup.data
  }
})

export default class PageColumnsEdit extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      match      : props.match,
      menuData   : props.menuData,
      msg        : props.popupMsg,
      formObject : {
        id               : props.seleEditData['id'],
        columnName       : props.seleEditData['columnName'],
        columnEnName     : props.seleEditData['columnEnName'],
        menuId           : props.seleEditData['menuId'],
        sort             : props.seleEditData['sort']
      }
    }
  }

  componentDidMount() {
    this.props.dispatch( getAllMenu() );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg            : nextProps.popupMsg,
      menuData       : nextProps.menuData
    })
  }

  handleChange(e){
    let formObject = this.state.formObject;
    let name       = e.target.name;
    let val        = e.target.value;
    formObject[name] = val;
    this.setState({
      formObject : formObject,
    });
  }

  handleSubmit(e){
    e.preventDefault();
    let formObject = this.state.formObject;
    let match      = this.state.match;
    this.props.dispatch( update(match,formObject) );
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">菜单列名称</li>
              <li>
                <div className="input-box">
                  <input type="text" name="columnName" value={this.state.formObject['columnName']} onChange={this.handleChange.bind(this)} required/>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">英文名称</li>
              <li>
                <div className="input-box">
                  <input type="text" name="columnEnName" value={this.state.formObject['columnEnName']} onChange={this.handleChange.bind(this)} required/>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">所屬主選單</li>
              <li>
                <div className="input-box" data-type="select">
                  <select name="menuId" value={this.state.formObject['menuId']} onChange={this.handleChange.bind(this)}>
                    {
                      this.state.menuData.map((item,i)=>{
                        return(
                          <option key={i} value={item.id}>{item.menuName}</option>
                        )
                      })
                    }
                  </select>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">排序权重</li>
              <li>
                <div className="input-box">
                  <input type="number" name="sort" value={this.state.formObject['sort']} onChange={this.handleChange.bind(this)} required/>
                </div>
              </li>
            </ul>
          </li>
          <li className="msg">{this.state.msg}</li>
          <li>
            <button type="submit">修改</button>
          </li>
        </ul>
      </form>
    );
  }
}
