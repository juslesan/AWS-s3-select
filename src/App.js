import React, { Component } from 'react';
import './App.css';
import ReactChartkick, { ColumnChart } from 'react-chartkick'
import Chart from 'chart.js'
ReactChartkick.addAdapter(Chart)

const  S3 = require('aws-sdk/clients/s3');
const client = new S3({
  region: 'us-east-1',
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  sessionToken: process.env.SESSION_TOKEN
});

const params = {
	Bucket: 'juslecsv',
	Key: 'API_SP.POP.TOTL_DS2_en_csv_v2_10473719.csv',
	ExpressionType: 'SQL',
	Expression: 'select s._1, s._62 from s3object s limit 19',
	InputSerialization: {
		CSV: {
			// FileHeaderInfo: 'USE',
			// RecordDelimiter: '\n',
			// FieldDelimiter: ','
		}
	},
	OutputSerialization: {
		CSV: {}
	}
};


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectData: '',
    }
    
  }
  componentDidMount() {

    client.selectObjectContent(params, (err, data) => {
      if (err) {
        console.log(err)
        switch (err.name) {
          // Check against specific error codes that need custom handling
        }
        return '';
      }
      // data.Payload is a Readable Stream
      const events = data.Payload;
      let string = ''
      for (const event of events) {
        if (event.Records) {
          // event.Records.Payload is a buffer containing
          // a single record, partial records, or multiple records
          string = event.Records.Payload.toString()
        } else if (event.Stats) {
          console.log(`Processed ${event.Stats.Details.BytesProcessed} bytes`);
        } else if (event.End) {
          console.log('SelectObjectContent completed');
        }
      }
      this.setState({selectData: string})
    });
  }
  jsonify(data) {
    let set = data.split('\n')
    // console.log(set)
    const json={
    }
    for (let i = 5; i < set.length; i++) {
      // console.log(set[i].split(',')[0])
      if (set[i].split(',')[0] !== 'Arab World')
      json[set[i].split(',')[0]] = set[i].split(',')[1]
    }
    
    return json
  }


  render() {
    const json = this.jsonify(this.state.selectData)
    console.log(json)
    return (
      <div className="App">
        <ColumnChart data={json} />

      </div>
    );
  }
}

export default App;
