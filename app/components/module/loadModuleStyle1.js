import React from 'react';

export default class loadModuleStyle1 extends React.Component{
    render(){
        return(
            <div className="loadingBox">
                <div className="checkBox-loading">
                    <div className="lds-css ng-scope">
                        <div className="lds-spinner" style={{ height: "100%" }}>
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}