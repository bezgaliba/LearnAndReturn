namespace my.LandR;
using { cuid, sap.common.CodeList, managed } from '@sap/cds/common';

entity CourseCategory : cuid, CodeList {
}

entity Course : cuid, managed {
    CourseName : String(100);
    Description : String(480);
    CourseCategory : Association to one CourseCategory;
    Review : Composition of many Reviews;
    CourseMaterial : Composition of many CourseMaterials;
}

aspect Reviews : cuid, managed {
    Rating : String(5);
    Comment : String(960);
}

entity LearningObject : cuid{
    Name : String(200);
    Type : String(20);
    Content : String(3040);
    Description : String(480);
}

aspect CourseMaterials : cuid, managed {
    LearningObject : Association to one LearningObject;
}