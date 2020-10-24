import React, { Component } from 'react';
import {connect} from 'react-redux';
import classnames from "classnames";
import {getProjectTask, upadateProjectTask} from "../../../actions/backlogAction";
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class UpdateProjectTask extends Component {

    constructor(){
        super();

        this.state = {
            id:"",
            projectSequence:"",
            summary: "",
            acceptanceCriteria: "",
            status: "",
            priority: 0,
            dueDate: "",
            projectIdentifier: "",
            create_At: "",
            errors: {}
        }
    }

    componentDidMount(){
        const {backlog_id, pt_id} = this.props.match.params;
        this.props.getProjectTask(backlog_id, pt_id, this.props.history);
    }

    componentWillReceiveProps(newProps){

        if(newProps.errors){
            this.setState({ errors: newProps.errors })
        }
        
        const {
            id,
            projectSequence,
            summary,
            acceptanceCriteria,
            status,
            priority,
            dueDate,
            projectIdentifier,
            create_At
        } = newProps.project_task;

        this.setState({
            id,
            projectSequence,
            summary,
            acceptanceCriteria,
            status,
            priority,
            dueDate,
            projectIdentifier,
            create_At
        });
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e){
        this.setState({[e.target.name]:e.target.value});
    }

    onSubmit(e){
        e.preventDefault()

        const UpdateProjectTask = {
            id: this.state.id,
            projectSequence: this.state.projectSequence,
            summary: this.state.summary,
            acceptanceCriteria: this.state.acceptanceCriteria,
            status: this.state.status,
            priority: this.state.priority,
            dueDate: this.state.dueDate,
            projectIdentifier:this.state.projectIdentifier,
            create_At: this.state.create_At
        }
        this.props.upadateProjectTask(this.state.projectIdentifier, this.state.projectSequence, UpdateProjectTask, this.props.history);

    }

    render() {
        const {errors}= this.state;
        return (
            <div className="add-PBI">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to={`/projectBoard/${this.state.projectIdentifier}`} className="btn btn-light">
                                Back to Project Board
                            </Link>
                            <h4 className="display-4 text-center">Update Project Task</h4>
                            <p className="lead text-center">Project Name: {this.state.projectIdentifier} + Project Task ID: {this.state.projectSequence}</p>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        className={classnames("form-control form-control-lg ",{
                                            "is-invalid": errors.summary
                                        })}  
                                        name="summary" 
                                        placeholder="Project Task summary" 
                                        value={this.state.summary}
                                        onChange={this.onChange}
                                    />
                                    {errors.summary && (
                                        <div className="invalid-feedback">{errors.summary}</div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <textarea 
                                        className={classnames("form-control form-control-lg ",{
                                            "is-invalid": errors.acceptanceCriteria
                                        })}                                          placeholder="Acceptance Criteria" 
                                        name="acceptanceCriteria"
                                        value={this.state.acceptanceCriteria}
                                        onChange={this.onChange}
                                    ></textarea>
                                    {errors.acceptanceCriteria && (
                                        <div className="invalid-feedback">{errors.acceptanceCriteria}</div>
                                    )}
                                </div>
                                <h6>Due Date</h6>
                                <div className="form-group">
                                    <input 
                                        type="date" 
                                        className={classnames("form-control form-control-lg ",{
                                            "is-invalid": errors.dueDate
                                        })}   
                                        name="dueDate" 
                                        value={this.state.dueDate}
                                        onChange={this.onChange}
                                    />
                                    {errors.dueDate && (
                                        <div className="invalid-feedback">{errors.dueDate}</div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <select 
                                        className={classnames("form-control form-control-lg ",{
                                            "is-invalid": errors.priority
                                        })}   
                                        name="priority"
                                        value={this.state.priority}
                                        onChange={this.onChange}
                                    >
                                        <option value={0}>Select Priority</option>
                                        <option value={1}>High</option>
                                        <option value={2}>Medium</option>
                                        <option value={3}>Low</option>
                                    </select>
                                    {errors.priority && (
                                        <div className="invalid-feedback">{errors.priority}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <select 
                                        className={classnames("form-control form-control-lg ",{
                                            "is-invalid": errors.status
                                        })}   
                                        name="status"
                                        value={this.state.status}
                                        onChange={this.onChange}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="TO_DO">TO DO</option>
                                        <option value="IN_PROGRESS">IN PROGRESS</option>
                                        <option value="DONE">DONE</option>
                                    </select>
                                    {errors.status && (
                                        <div className="invalid-feedback">{errors.status}</div>
                                    )}
                                </div>

                                <input type="submit" className="btn btn-primary btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

UpdateProjectTask.propTypes = {
    getProjectTask: PropTypes.func.isRequired,
    project_task: PropTypes.object.isRequired,
    upadateProjectTask: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    project_task: state.backlog.project_task,
    errors: state.errors
})

export default connect(mapStateToProps, {getProjectTask, upadateProjectTask}) (UpdateProjectTask);