import React, { useContext, useState } from "react";
import { PostList } from "../store/PostlistStore";
import CreatePost from "./CreatePost";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Box,
  Container,
  Stack,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const PostListDisplay = () => {
  const { postList, deletePost } = useContext(PostList);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(postId);
    }
  };

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          📱 All Posts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePost}
          sx={{ borderRadius: 3, fontWeight: 600 }}
        >
          Create Post
        </Button>
      </Stack>

      {showCreateModal && (
        <Box mb={4}>
          <CreatePost onPostCreated={handleCloseModal} />
        </Box>
      )}

      {postList.length === 0 ? (
        <Box textAlign="center" mt={8}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            📝 No posts yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Create your first post to get started!
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleCreatePost}
            sx={{ borderRadius: 3 }}
          >
            Create Your First Post
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {postList.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card sx={{ borderRadius: 4, boxShadow: 3, minHeight: 220 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {post.body}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={2} mb={1}>
                    {post.tags &&
                      post.tags.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={`#${tag}`}
                          size="small"
                          color="primary"
                        />
                      ))}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    👤 {post.user_id} &nbsp; | &nbsp; ❤️ {post.reaction}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(post.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PostListDisplay;
