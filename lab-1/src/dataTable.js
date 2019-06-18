import React from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
// 產品目錄(資料)
import products from './products.json';

class DataTable extends React.Component {
  constructor(props) {
    //在子类的constructor中必须先调用super才能引用this
    super(props);
    // 初始化狀態
    this.state = {
      gridData:products
    };
  }
  render(){
    return(
      <Grid
        style={{ height: '400px',width:'650px' }}
        data={this.state.gridData}
      >
        <Column field='ProductID' title='ID' width='85px' />
        <Column field='ProductName' title='Product Name' width='200px' />
        <Column field='UnitsInStock' title='Units In Stock' width='180px'/>
        <Column field='Discontinued' width='180px'
          cell={(props) => {return (
            <td>
              <input disabled type='checkbox' checked={props.dataItem[props.field]} />
            </td>
          );}} 
        />
        <Column field='Category.CategoryName' title='CategoryName' width='200px' />
        
      </Grid>
    );
  }
}
export default DataTable;
