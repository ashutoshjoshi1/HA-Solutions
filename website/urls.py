from django.urls import path
from . import views
from . import admin_views

urlpatterns = [
    # Home
    path('', views.index, name='index'),
    
    # Contact
    path('contact/', views.contact, name='contact'),
    
    # Careers
    path('careers/', views.careers, name='careers'),
    path('careers/job/<int:job_id>/', views.job_detail, name='job_detail'),
    path('careers/apply/', views.careers_apply, name='careers_apply'),
    
    # Recruiter Admin Portal (Hidden)
    path('recruiter/login/', admin_views.recruiter_login, name='recruiter_login'),
    path('recruiter/dashboard/', admin_views.recruiter_dashboard, name='recruiter_dashboard'),
    path('recruiter/create/', admin_views.create_job, name='create_job'),
    path('recruiter/update/<int:job_id>/', admin_views.update_job, name='update_job'),
    path('recruiter/delete/', admin_views.delete_job, name='delete_job'),
    path('recruiter/delete/<int:job_id>/', admin_views.delete_job_confirm, name='delete_job_confirm'),
    path('recruiter/logout/', admin_views.recruiter_logout, name='recruiter_logout'),
    
    # Companies
    path('companies/', views.companies_index, name='companies_index'),
    
    # About
    path('about/', views.about, name='about'),
    path('about/team/', views.about_team, name='about_team'),
    path('about/partnerships/', views.about_partnerships, name='about_partnerships'),
    
    # Candidates
    path('candidates/', views.candidates, name='candidates'),
    path('candidates/veterans/', views.candidates_veterans, name='candidates_veterans'),
    path('candidates/training/', views.candidates_training, name='candidates_training'),
    path('candidates/career/', views.candidates_career, name='candidates_career'),
    
    # Federal
    path('federal/', views.federal, name='federal'),
    
    # Technology
    path('technology/aws/', views.technology_aws, name='technology_aws'),
    path('technology/databricks/', views.technology_databricks, name='technology_databricks'),
    path('technology/mulesoft/', views.technology_mulesoft, name='technology_mulesoft'),
    path('technology/pega/', views.technology_pega, name='technology_pega'),
    path('technology/salesforce/', views.technology_salesforce, name='technology_salesforce'),
    path('technology/sap/', views.technology_sap, name='technology_sap'),
    path('technology/servicenow/', views.technology_servicenow, name='technology_servicenow'),
    path('technology/workday/', views.technology_workday, name='technology_workday'),
    
    # Industry
    path('industry/data-centers/', views.industry_data_centers, name='industry_data_centers'),
    path('industry/financial/', views.industry_financial, name='industry_financial'),
    path('industry/healthcare/', views.industry_healthcare, name='industry_healthcare'),
    path('industry/semiconductor/', views.industry_semiconductor, name='industry_semiconductor'),
    path('industry/telecommunications/', views.industry_telecommunications, name='industry_telecommunications'),
]

