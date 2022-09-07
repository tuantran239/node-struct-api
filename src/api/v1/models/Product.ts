import { Schema, model, Document } from 'mongoose'

export interface ProductDocument extends Document {
  name: string
  gender: string
  description: string
  price: number
  categories: string[]
  mainImage: {
    url: string
    public_id: string
  }
  images: [
    {
      url: string
      public_id: string
    }
  ]
  productType: [
    {
      color: string
      sizes: [
        {
          name: string
          amount: number
        }
      ]
    }
  ]
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      text: true
    },
    gender: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      deafult: 0
    },
    categories: {
      type: [String]
    },
    mainImage: {
      url: String,
      public_id: String
    },
    images: [
      {
        url: String,
        public_id: String
      }
    ],
    productType: [
      {
        color: String,
        sizes: [
          {
            name: String,
            amount: {
              type: Number,
              default: 0
            }
          }
        ]
      }
    ]
  },
  {
    timestamps: true
  }
)

productSchema.index({ _id: 1, categories: 1, '$productType.color': 1 })

const Product = model<ProductDocument>('Product', productSchema)

export default Product
