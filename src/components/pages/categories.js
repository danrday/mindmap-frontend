import React, { Component } from "react";
import { connect } from "react-redux";
import {changeSelectedCategory, handleCheckboxChange, editValue} from "../../redux/actions/categoryEdit";
import { saveCategoryEdit} from "../../redux/actions/simpleAction";

class Categories extends Component {

    handleCheckboxChange(event) {
        const target = event.target;
        let attrs = this.props.categoryEdit.checkedAttrs

        if (attrs.includes(target.name) && !target.checked) {
            attrs = attrs.filter(e => e !== target.name)
        } else if (!attrs.includes(target.name) && target.checked) {
            attrs.push(target.name)
        }

        this.props.handleCheckboxChange(attrs)
    }

    save() {

        let currentCats = this.props.categories

        let currCatName = this.props.categoryEdit.category

        let newCatName = this.props.categoryEdit.newCategoryName

        delete currentCats[currCatName]

        currentCats[newCatName] = {}

        this.props.categoryEdit.checkedAttrs.forEach(item => {
            currentCats[newCatName][item] = this.props.categoryEdit[item]
        })

        currentCats[newCatName].category = newCatName

        this.props.saveCategoryEdit({currentCats, currCatName, newCatName});
    }


    render() {
        return (
            <div>
               categories

                <button onClick={this.save.bind(this)}>save</button>

                <br/>

                <select  onChange={e => this.props.changeSelectedCategory({categories: this.props.categories, value:e.target.value})} value={this.props.categoryEdit.category || 'none'} >
                    <option key='-1' default value='none'>(None)</option>
                    {Object.keys(this.props.categories).map((cat, i) => {
                        return <option key={i} value={cat}>{cat}</option>
                    })}
                </select>


                <br /><br />
                <div>category name</div>
                <input
                    type="text"
                    value={this.props.categoryEdit.newCategoryName || ""}
                    onChange={event => this.props.editValue({key: 'newCategoryName', value: event.target.value})}
                />
                <br /> <br />

                <hr/>
                <div>custom attributes</div>
                <br />

                <input
                    name="radius"
                    type="checkbox"
                    checked={this.props.categoryEdit.checkedAttrs.includes('radius')}
                    onChange={this.handleCheckboxChange.bind(this)} />
                <div>radius</div>
                <input
                    disabled={!this.props.categoryEdit.checkedAttrs.includes('radius')}
                    type="number"
                    value={this.props.categoryEdit.radius || ""}
                    onChange={event => this.props.editValue({key: 'radius', value: event.target.value})}
                />
                <br />
                <input
                    name="fontSize"
                    type="checkbox"
                    checked={this.props.categoryEdit.checkedAttrs.includes('fontSize')}
                    onChange={this.handleCheckboxChange.bind(this)} />
                <div>font size</div>
                <input
                    disabled={!this.props.categoryEdit.checkedAttrs.includes('fontSize')}
                    type="number"
                    value={this.props.categoryEdit.fontSize || ""}
                    onChange={event => this.props.editValue({key: 'fontSize', value: event.target.value})}
                />


            </div>
        );
    }
}


const mapStateToProps = state => ({
    categoryEdit: state.categoryEdit,
    categories: state.simpleReducer.editedFile.categories,
});

const mapDispatchToProps = dispatch => ({
    changeSelectedCategory: (cat) => dispatch(changeSelectedCategory(cat)),
    handleCheckboxChange: checkedAttrs => dispatch(handleCheckboxChange(checkedAttrs)),
    editValue: keyAndValue => dispatch(editValue(keyAndValue)),
    saveCategoryEdit: edits => dispatch(saveCategoryEdit(edits))

});
export default connect(mapStateToProps, mapDispatchToProps)(Categories);
