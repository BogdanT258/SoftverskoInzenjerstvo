import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,{
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
});

export const Users = sequelize.define("users",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email:{
        type:DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },

    password:{
        type: DataTypes.STRING(255),
        allowNull: false
    },

    full_name:{
        type: DataTypes.STRING(255),
        allowNull: false
    },

    role:{
        type: DataTypes.ENUM("student", "librarian"),
        allowNull: false,
        defaultValue: "student"
    },

    index_number: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
},{
    tableName:"users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes:[
        {
            name:"idx_email",
            fields:["email"]
        },
        {
            name:"idx_role",
            fields:["role"]
        }
    ]
});

export const Books = sequelize.define("books",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title:{
        type: DataTypes.STRING(500),
        allowNull: false
    },

    author:{
        type: DataTypes.STRING(255),
        allowNull: false
    },

    isbn: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
    },

    category:{
        type: DataTypes.STRING(100),
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    publisher:{
        type:DataTypes.STRING(255),
        allowNull: true
    },

    publish_year:{
        type:DataTypes.INTEGER,
        allowNull: true
    },

    total_copies:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue: 1
    },

    available_copies: {
        type: DataTypes.INTEGER,
        allowNull:true,
        validate:{
            min:0,
            max(value){
                if(value > this.total_copies){
                    throw new Error("available_copies > total_copies")
                }
            }
        }
    },

    image_url:{
        type:DataTypes.STRING(500),
        allowNull: true
    }
},{
    tableName:"books",
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes:[
        {
            name:"idx_category",
            fields:["category"]
        },
        {
            name:"idx_isbn",
            fields:["isbn"]
        },
        {
            name:"idx_title",
            fields:["title"]
        },
        {
            name:"idx_author",
            fields:["author"]
        }
    ]
});

export const Loans = sequelize.define("loans",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },

    book_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },

    loan_date:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue:DataTypes.NOW
    },

    due_date:{
        type:DataTypes.DATE,
        allowNull:false
    },

    return_date:{
        type:DataTypes.DATE,
        allowNull:true
    },

    status:{
        type:DataTypes.ENUM("active", "returned", "overdue"),
        allowNull:false,
        defaultValue:"active"
    }
},{
    tableName:"loans",
    timestamps:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes:[
        {
            name:"idx_user_id",
            fields:["user_id"]
        },
        {
            name:"idx_book_id",
            fields:["book_id"]
        },
        {
            name:"idx_status",
            fields:["status"]
        },
        {
            name:"idx_due_date",
            fields:["due_date"]
        },
        {
            name:"idx_user_book",
            fields:["user_id", "book_id"]
        }
    ]
});

Users.hasMany(Loans, { foreignKey: "user_id" });
Loans.belongsTo(Users, { foreignKey: "user_id", onDelete: "CASCADE" });

Books.hasMany(Loans, { foreignKey: "book_id" });
Loans.belongsTo(Books, { foreignKey: "book_id", onDelete: "RESTRICT" });

