import React from 'react';
import { Grid, GridColumn as Column, GridToolbar } from '@progress/kendo-react-grid';
import { orderBy,filterBy } from '@progress/kendo-data-query';
import products from './products.json'; // 產品目錄(資料)

const editJson = (json, field, value) => {
  const jsonArray = json;
  const fields = field.split('.');
  jsonArray[fields[0]] = (fields.length === 1) ? value : editJson(json[fields[0]], fields.slice(1).join('.'), value);
  return jsonArray;
};
const findMaxId = (datas) => {
  let result = 0;
  datas.forEach((data) => {
    if (result < data.ProductID) {
      result = data.ProductID;
    }
  });
  return result;
};
class DataTable extends React.Component {
  constructor(props) {
    // 在子类的constructor中必须先调用super才能引用this
    super(props);
    // 初始化狀態
    // ui
    this.booleanCell = this.booleanCell.bind(this);
    // function
    this.rowEdit = this.rowEdit.bind(this);
    this.itemChange = this.itemChange.bind(this);
    this.exitEdit = this.exitEdit.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onAddClick = this.onAddClick.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.state = {
      gridData: JSON.parse(JSON.stringify(products)), // deep copy
      saveGridData: JSON.parse(JSON.stringify(products)), // deep copy
      changed: false,
      editItem: null,
      sort: [],
      filter: []
    };
  }

  render() {
    return (
      <Grid
        style={{ height: '400px', width: '970px' }}
        data={filterBy(orderBy(this.state.gridData,this.state.sort),this.state.filter)}
        onRowClick={this.rowEdit}
        onItemChange={this.itemChange}
        editField='inEdit'
        resizable={true}
        sortable={true}
        sort={this.state.sort}
        onSortChange={(e)=>{this.setState({sort: e.sort});}}
        filterable
        filter={this.state.filter}
        onFilterChange={
          (e) => {
            this.setState({filter: e.filter});
          }
        }
      >
        <GridToolbar>
          <div onClick={this.exitEdit}>
            <button onClick={this.onSaveClick} disabled={!this.state.changed}>
              Save
            </button>
            <button onClick={this.onCancelClick} disabled={!this.state.changed}>
              Cancel
            </button>
            <button onClick={this.onAddClick}>
              Add new
            </button>
          </div>
        </GridToolbar >
        <Column field='ProductID' title='ID' width='85px' editable={false} filterable={false}/>
        <Column field='ProductName' title='Product Name' width='200px' />
        <Column field='UnitsInStock' title='Units In Stock' width='180px' editor='numeric' filter='numeric'/>
        <Column field='Discontinued' width='180px' cell={this.booleanCell} filter='boolean' />
        <Column field='Category.CategoryName' title='CategoryName' width='200px' />
        <Column title="Edit"  width='120px' cell={this.onDeleteItem} filterable={false} />
      </Grid>
    );
  }

  // ui
  booleanCell = (props) => {
    return (props.dataItem.inEdit) ? (
      <td>
        <input
          onChange={
            (event) => {
              const obj = this.state.gridData;
              const index = obj.findIndex((o) => {return props.dataItem.ProductID === o.ProductID;});
              obj[index][props.field] = event.target.checked;
              this.setState({ gridData: obj, changed: true });
            }
          }
          type='checkbox'
          checked={props.dataItem[props.field]} />
      </td>
    ) : (
      <td>
        <input disabled type='checkbox' checked={props.dataItem[props.field]} />
      </td>
    );
  }
  onDeleteItem=(eventItem)=>{
    return (<td>
      <button onClick={()=>{
        const data = this.state.gridData;
        const delIndex = data.findIndex(p => {return p.ProductID === eventItem.dataItem.ProductID;});
        if (delIndex >-1){
          if(window.confirm('Press a button')){
            data.splice(delIndex,1);
            this.setState({gridData: data, changed: true});
          }
        }
      }}>
        remove
      </button>
    </td>);
  }
  // function
  onSaveClick = () => {
    const datas = this.state.gridData.map(
      (d) => {
        const data = d;
        data.inEdit = false;
        return data;
      }
    );
    this.setState(
      {
        saveGridData: JSON.parse(JSON.stringify(datas)),
        editItem: null,
        changed: false
      }
    ); // deep copy
  };

  onCancelClick = () => {
    const datas = this.state.saveGridData.map(
      (d) => {
        const data = d;
        data.inEdit = false;
        return data;
      }
    );
    this.setState(
      {
        gridData: JSON.parse(JSON.stringify(datas)),
        editItem: null,
        changed: false
      }
    ); // deep copy
  };

  onAddClick = () => {
    const newItem = this.state.gridData.map(
      (d) => {
        const data = d;
        data.inEdit = false;
        return data;
      }
    );
    newItem.push({
      ProductID: findMaxId(this.state.gridData) + 1,
      ProductName: '',
      Discontinued: false,
      Category: {
        CategoryID: 0,
        CategoryName: ''
      },
      inEdit: true
    });
    this.setState({ gridData: newItem, changed: true });
  }

  itemChange = (event) => {
    const obj = this.state.gridData;
    const index = obj.findIndex((o) => { return event.dataItem.ProductID === o.ProductID; });
    obj[index] = editJson(obj[index], event.field, event.value);
    this.setState({ gridData: obj, changed: true });
  }

  exitEdit = (event) => {
    if (event.target === event.currentTarget) {
      const datas = this.state.gridData.map(
        (d) => {
          const data = d;
          data.inEdit = false;
          return data;
        }
      );
      this.setState({
        data: datas,
        editItem: null
      });
    }
  }

  rowEdit = (e) => {
    if (this.state.editItem === e.dataItem.ProductID) {
      return;
    }
    const data = this.state.gridData.map((item) => {
      const result = item;
      result.inEdit = item.ProductID === e.dataItem.ProductID;
      return result;
    });
    this.setState({
      editItem: e.dataItem.ProductID,
      gridData: data
    });
  };
}
export default DataTable;
