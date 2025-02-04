import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'
import Loader from 'react-loader-spinner'
import SimilarJobs from '../SimilarJobs'

const apiStatusConstants={
    initial:'INITIAL',
    success:'SUCCESS',
    failure:'FAILURE',
    inProgress:'IN_PROGRESS'
}

class AboutJobItem extends Component{
    state={jobDataDetails:[],similarJobData:[], apiStatus:apiStatusConstants.initial}

    componentDidMount(){
        this.getJobData()
    }

    getJobData=async props=>{
        const {match}=this.props
        const {params}=match
        const {id}=params
        this.setState({apiStatus:apiStatusConstants.inProgress})
        const apiUrl=`https://apis.ccbp.in/jobs/${id}`
        const jwtToken=Cookies.get('jwt_token')
        const options={
            headers:{
                Authorization:`Bearer ${jwtToken}`
            }, 
            method:'GET'
        }

        const response=await fetch(apiUrl, options)
        if(response.ok===true){
            const fetchedData=await response.json()
            const updatedData=fetchedData.job_details.map(each=>({
                companyLogoUrl:each.companyLogoUrl,
                companyWebsiteUrl:each.company_website_url,
                employmentType:each.employment_type,
                jobDescription:each.jon_description,
                id:each.id,
                skills:each.skills.map(eachSkill=>({
                    imageUrl:eachSkill.image_url,
                    name:eachSkill.name
                })),
                title:each.title,
                lifeAtCompany:{
                    description:each.life_at_company.description,
                    imageUrl:each.life_at_company.image_url
                },
                location:each.location,
                packagePerAnnum:each.package_per_annum,
                rating:each.rating
            }))

            const updatedSimilarJobDetails=fetchedData.similar_jobs.map(eachItem=>({
                companyLogoUrl:eachItem.company_logo_url,
                employmentType:eachItem.employment_type,
                id:eachItem.id,
                jobDescription:eachItem.job_description,
                location:eachItem.location,
                rating:eachItem.rating,
                title:eachItem.title

            }))

            this.setState({
                jobDataDetails:updatedData, similarJobData:updatedSimilarJobDetails,apiStatus:apiStatusConstants.success
            })
        }
        else{
            this.setState({apiStatus:apiStatusConstants.failure})
        }
    }

    renderJobDetailsSuccessView=()=>{
        const {jobDataDetails, similarJobData}=this.state
        if(jobDataDetails.length>=1){
        const {companyLogoUrl,
               companyWebsiteUrl,
               employmentType,
               id,
               jobDescription,
               skills,
               lifeAtCompany,
               location, 
               packagePerAnnum,
               rating,
               title}=jobDataDetails[0]
return(
    <>
    <div className="job-container">
    <div className="first-part">
    <div className="title-rating">
        <img src={companyLogoUrl} alt{name} className="company-img"/>
        <div className="title-container">
            <h1 className="title">{title}</h1>
            <div className="star-card">
                <AiFillStar size={24}/>
                <p className="text">{rating}</p>
            </div>
            </div>
        </div>
        <div className="location-package-container">
            <div className="left-pack">
                <div className="location">
                    <MdLocationOn size={24}/>
                    <p className="text">{location}</p>
                </div>
                <div className="job-type">
                    
                    <p className="text">{employmentType}</p>
                </div>
                
            </div>
            <div className="right-part">
                <p className="text">{packagePerAnnum}</p>
            </div>
        </div>
        <hr className="line"/>
        <div className="description-card">
            <h1 className="heading">Description</h1>
            <a href={companyLogoUrl} className="link">Visit <BiLinkExternal size={24}/></a>
        </div>
        <p className="text">{jobDescription}</p>
        <h1 className="heading">Skills</h1>
        <ul className="list-container">
            {skills.map(eachData=>(
                <li className="list-item" key={eachItem.name}>
                    <img src={eachData.imageUrl} alt={eachData.name} className="image"/>
                    <p className="text">{eachData.name}</p>
                </li>
            ))}
        </ul>
        <div className="company-life-container">
        <div className="company-life">
        <h1 className="title">Life at Company</h1>

        
            <p className="text">{lifeAtCompany.description}</p>
            </div>
            <img className="life-img" src={lifeAtCompany.imageUrl} alt="life at company" />

        </div>

            
    </div>
    <p className="heading">Similar Jobs</p>
    <ul className="list-container">
        {similarJobData.map(eachItem=>(
            <SimilarJobs key={eachItem.id} similarJobsData={eachItem} employmentType={employmentType}/>

        ))}
    </ul>

    </div>
    </>
)
        }
        return null

    }

    onRetry=()=>{
        this.getJobData()
    }

    renderFailureView=()=>(
        <div className="failure-view">
            <img src="https://assets.ccbp.in/frontend/react-js/failure-img.png" alt="failure view" className="failure-image"/>
            <h1 className="failure">Oops! Something Went Wrong</h1>
            <p className="fail-text">We cannot seem to find the page you are looking for.</p>
            <button className="button" type="button" onClick={this.onRetry}>Retry</button>
        </div>

    )

    renderLoadingView=()=>(
        <div className="loader-container" data-testid="loader">
  <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
</div>
    )

    renderJobDetails=()=>{
        const {apiStatus}=this.state

        switch(apiStatus){
            case apiStatusConstants.inProgress:
                return this.renderLoadingView()
            case apiStatusConstants.success:
                return this.renderJobDetailsSuccessView()
            case apiStatusConstants.failure:
                return this.renderFailureView()
            default:
                return null            
        }
    }

    render(){
        return(
            <>
            <Header />
            <div className="container">{this.renderJobDetails()}</div>
            </>
        )
    }
}

export default AboutJobItem