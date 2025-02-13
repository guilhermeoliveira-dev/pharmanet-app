import React from 'react';

class CarrinhoPopup extends React.Component {

    constructor(props) {
        super(props);
        this.state = localStorage.getItem("carrinho_itens") ?? {
          
        };
      }

    render() {
        return (
            <div className='card md-3'>
                {/* <h3 className='card-header'>{this.props.title}</h3> */}
                <div className='card-body'>{this.props.children}</div>
            </div>
        );
    }
}

export default CarrinhoPopup;