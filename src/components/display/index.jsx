import React, { Component } from 'react';
import axios from 'axios';
import './index.css';

class Display extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      error: [/* 
        'Please fill category',
        'Please fill title',
        'Please fill exp date',
        'Please fill amount' */
      ],
      exampleInputCategory: '',
      exampleInputTitle: '',
      exampleInputExpDate: '',
      exampleInputAmount: '',
      exampleId: 0,
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData() {
    var urlExpense = "http://localhost:3002/expense";
    axios.get(urlExpense)
      .then(response => this.setState({tableData: response.data.data}, () => {
        this.setState({exampleId: response.data.data.length});
      }));
  }
  isValidate(payload) {
    var error = [];
    var condition = payload.category.length >= 3 &&
    payload.title.length >= 3 &&
    payload.exp_date &&
    payload.amount;
    /* if(/^\d{4}-\d{2}-\d{2}$/.test(payload.exp_date)) {
      error.push('Please enter valid date!!');
      this.setState({error});
      return false;
    } */
    if(/^-?\d*[.,]?\d{0,2}$/.test(payload.amount) === false) {
      error.push('Please use number for fill!!');
      this.setState({error});
      return false;
    }
    return condition;
  }
  submitFormData(e) {
    e.preventDefault();
    var url = 'http://localhost:3002/expense';
    var indexId = this.state.exampleId + 1;
    this.setState({exampleId: indexId});
    console.log(this.state.exampleId);
    const payload = {
        category: '', title: '', exp_date: '', amount: 0, id: 0
    }
    console.log(payload);
    payload.category = this.state.exampleInputCategory;
    payload.title = this.state.exampleInputTitle;
    payload.exp_date = this.state.exampleInputExpDate;
    payload.amount = this.state.exampleInputAmount;
    payload.id = this.state.exampleId;
    if(this.isValidate(payload)) {
      axios.post(url, payload)
        .then(response => {
          this.setState(prevState => ({
            tableData: [...prevState.tableData, payload]
          }));      
        });
    } else {
      alert()
    }
  }
  
  onFieldChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  removeData(item) {
    console.log(item);
    var url = 'http://localhost:3002/expense';
    axios.delete(url, {
      id: 0
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }

  render() { 
    return (
      <div className="display-block">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h3>Expense Entry</h3>
              <hr/>
              {this.state.error.length > 0 && <div className="">{this.state.error.map((i, j) => {
                return (<span className="err-msg" key={j}>{i}</span>)
              })}<hr/></div>}
              <form onSubmit={this.submitFormData.bind(this)}>
                <div className="form-group">
                  <label htmlFor="exampleInputCategory">Category</label>
                  <input
                    type="text"
                    value={this.state.category}
                    onChange={this.onFieldChange.bind(this)}
                    className="form-control"
                    id="exampleInputCategory"
                    name="exampleInputCategory"
                    aria-describedby="CategoryHelp"
                    placeholder="Enter Category" />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputTitle">Title</label>
                  <input
                    type="text"
                    value={this.state.title}
                    onChange={this.onFieldChange.bind(this)}
                    className="form-control"
                    id="exampleInputTitle"
                    name="exampleInputTitle"
                    aria-describedby="TitleHelp"
                    placeholder="Enter Title" />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputExpDate">Exp Date</label>
                  <input
                    type="date"
                    value={this.state.expDate}
                    onChange={this.onFieldChange.bind(this)}
                    className="form-control"
                    id="exampleInputExpDate"
                    name="exampleInputExpDate"
                    aria-describedby="ExpDateHelp"
                    placeholder="Enter Exp Date" />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputAmount">Amount</label>
                  <input
                    type="text"
                    value={this.state.amount}
                    onChange={this.onFieldChange.bind(this)}
                    className="form-control"
                    id="exampleInputAmount"
                    name="exampleInputAmount"
                    aria-describedby="AmountHelp"
                    placeholder="Enter Amount" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
              </div>
            {this.state.tableData.length > 0 && <div className="col-md-6">
              <h3>Expense List</h3>
              <table className="display-block-table table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody id="exp_tbody">
                  {this.state.tableData.map((item, j) => {
                    return (<tr key={j}><td>{item.category}</td><td>{item.title}</td><td>{item.exp_date}</td><td>{item.amount}</td><td onClick={() => {this.removeData(item)}}>X</td></tr>)
                  })}
                </tbody>
              </table>
            </div>}
          </div>
        </div>
        
      </div>
    );
  }
}
 
export default Display;