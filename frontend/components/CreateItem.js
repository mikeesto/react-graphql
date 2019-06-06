import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

const CreateItem = () => {
  const [title, updateTitle] = useState("Cool shoes");
  const [description, updateDescription] = useState("I love shoes");
  const [image, updateImage] = useState("");
  const [largeImage, updateLargeImage] = useState("dog-large.jpg");
  const [price, updatePrice] = useState(1000);

  const uploadFile = async e => {
    console.log("uploading file");
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhaetf1v0/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();
    updateImage(file.secure_url);
    updateLargeImage(file.eager[0].secure_url);
  };

  return (
    <Mutation
      mutation={CREATE_ITEM_MUTATION}
      variables={{ title, description, image, largeImage, price }}
    >
      {(createItem, { loading, error }) => (
        <Form
          onSubmit={async e => {
            // Stop the form from submitting
            e.preventDefault();
            // Call the mutation
            const res = await createItem();
            // Route to the single item page
            console.log(res);
            Router.push({
              pathname: "/item",
              query: { id: res.data.createItem.id }
            });
          }}
        >
          <Error error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input
                type="file"
                id="file"
                name="file"
                placeholder="Upload an image"
                required
                onChange={e => uploadFile(e)}
              />
              {image && <img src={image} width="200" alt="Upload Preview" />}
            </label>

            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                required
                value={title}
                onChange={e => updateTitle(e.target.value)}
              />
            </label>

            <label htmlFor="price">
              Price
              <input
                type="number"
                id="price"
                name="price"
                placeholder="0"
                required
                value={price}
                onChange={e => updatePrice(e.target.value)}
              />
            </label>

            <label htmlFor="description">
              Description
              <textarea
                id="description"
                name="description"
                placeholder="Enter a description"
                required
                value={description}
                onChange={e => updateDescription(e.target.value)}
              />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default CreateItem;
export { CREATE_ITEM_MUTATION };
