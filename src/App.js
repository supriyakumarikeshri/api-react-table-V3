import React,{Component} from 'react';
import './App.css';
import axios from 'axios';
 
class App extends React.Component {
  constructor() {
    super();
    this.state = {data: [""],filteredData: [""],searchInput:"",sortDirection:"",sortingIsRequired:false,sortColumn:""};
    this.tableHeading = "";
   }
  componentDidMount(){
    axios.get(`http://starlord.hackerearth.com/TopRamen`)
      .then(res => {
            this.setState({
                data: res.data
            });
            const headerData = Object.keys(res.data[0]);
            this.setState({
                tableHeading: headerData ,sortingIsRequired :true  
            });
            
      })
      .catch(error => {
          console.log(error)
      });
  }
  handleChange=(event)=>{
    //search filter based on first td data    
    console.log(event.currentTarget);  
       this.setState({
                  searchInput: event.target.value
             });
      const {tableHeading}=this.state;
      if(event.target.value.length){
               let filteredData = this.state.data.filter((value,key) => {

                return (value[tableHeading[0]].toLowerCase().includes(event.target.value.toLowerCase()));

                });
              this.setState({
                  filteredData: filteredData
             });
    } 
}
 handleSort = (column,sortingIsRequired) =>{
  if(sortingIsRequired){
      const {sortDirection,data} = this.state;
      console.log(sortDirection); 
      const comparer = (a, b) => {
        if(sortDirection=="" || sortDirection === "DESC"){
              this.setState({
                   sortDirection : "ASC"
                }); 
              return a[column] > b[column] ? 1 : -1; //making data in ascending order
              
          }else if(sortDirection === "ASC"){
            this.setState({
                   sortDirection : "DESC"
               });
            return a[column] < b[column] ? 1 : -1; //making data in descending order
          }
           
        };
        const sortedData = data.sort(comparer);
         this.setState({
            data : sortedData, sortColumn: column
          });
      }
 }
  render() {
    const {filteredData,data,searchInput,tableHeading,sortDirection,sortingIsRequired,sortColumn}=this.state;
    const searchplaceHolder=tableHeading ? "Search By "+tableHeading[0] + "......" : "";
    const dataToDisplay = searchInput.length ? filteredData : data;
    console.log(sortColumn);
    const tableHeader = tableHeading && tableHeading.map((val,ind)=>  
                        {
                            return (<th onClick={() => this.handleSort(val,sortingIsRequired)} key={ind}>{val}
                                        {sortingIsRequired? <div style={{"display":sortColumn === val ? 'initial' : 'none',}}>
                                             
                                             {sortDirection=="ASC" ? (
                                                  <div className="glyphicon glyphicon-menu-up" />
                                                ) : (
                                                  <div className="glyphicon glyphicon-menu-down" />
                                              )}
                                        </div>:""}
                              </th>);
                        });
    
    const tableData = dataToDisplay && dataToDisplay.map((rowObj, i) => {
                                   let td = Object.keys(rowObj).map((val, ind) => {
                                        return <td key={ind}>{rowObj[val]}</td>  
                                   })
                                  return ( <tr key={i}>{td}</tr>)
                    }); 
    return (
          <div>
            <input type="text" className="searchbar" onChange={this.handleChange} placeholder={searchplaceHolder} /> 
            <table id="customers">
              <thead>
                  <tr>
                      {tableHeader} 
                   </tr>
               </thead>
               <tbody>
                    {tableData} 
               </tbody>
           </table>
          </div>);  
    
  }
    }


 //{data.map(buildRow)}
 
export default App;
 