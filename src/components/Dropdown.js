import React from 'react';

function Dropdown(props) {
  return (
    <div>
      <select onChange={props.change} value={props.value}>
        <option value='0'>Select a playlist</option>
        {props.options.map((item) => <option key={item.id} value={item.id}>{item.name}</option> )}
      </select>
    </div>
  );
}

export default Dropdown;